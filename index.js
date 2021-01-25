const express = require('express');
// mongoose required to connect to mongodb
const mongoose = require('mongoose');
// bcrypt for hashing passwords
const bcrypt = require('bcrypt');
const cors = require('cors');
const body_parser = require('body-parser')
const { User, Student, Faculty, Response, Test } = require('./Models');

mongoose.connect("mongodb://localhost/quiz", {
    useNewUrlParser: true,
    useUnifiedTopology: true, useCreateIndex: true
})
    .then(() => {
        console.log("Connected")
    })
    .catch((err) => {
        console.log(err)
    })

const app = express();
app.use(cors())
app.use(body_parser.json())


app.get('/quiz/:tId', async (req, res) => {
    const { tId } = req.params;
    try {
        const questionnaire = await Test.findById(tId, ('questionnaire -_id')).exec();
        res.json(questionnaire);
    }
    catch (err) {
        res.status(400).json("Something went wrong. Please try again later.");
    }
})
app.post('/quiz', async (req, res) => {
    const { testName,
        subject,
        host,
        questions,
        options,
        answers,
        year,
        dept,
        section,
        dateAndTime } = req.body;
    let questionnaire = []
    questions.forEach((q, index) => {
        const question = {
            id: index + 1,
            text: q,
            options: options[index].reduce((acc, op, id) => {
                acc[id + 1] = op;
                return acc;
            }, {}),
            correctOption: answers[index] + 1
        };
        questionnaire.push(question);
    });
    const test = new Test({ name: testName, 
        subject, 
        host, 
        questionnaire, 
        year, dept, 
        section, dateAndTime });
    try {
        const t = await test.save();
        res.json("Success!");
    }
    catch (err) {
        console.log(err);
        res.status(400).json("Something went wrong !");
    }
})

app.post('/assessments', async (req, res) => {
    const { year, dept, section, sId } = req.body;
    const tests = await Test.find({ year, dept, section, dateAndTime: { $gte: new Date() } });
    res.json(tests);
})

// signin
app.post('/signin', async (req, res) => {
    const { uId, password } = req.body;
    try {
        const usr = await User.findOne({ uId }).exec();
        const result = await bcrypt.compare(password, usr.hash);
        if (result) {
            if (usr.role === 'student') {
                const stud = await Student.findOne({ sId: usr._id }).populate("sId", 'role uId').exec();
                res.json({ ...stud._doc, role: stud.sId.role });
            }
            if (usr.role === 'faculty') {
                const fac = await Faculty.findOne({ fId: usr._id }).populate("fId", 'role uId').exec();
                res.json({ ...fac._doc, role: fac.fId.role });
            }
        }
        else {
            res.status(400).json("Wrong Password. Please enter correct password to log in.");
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json("Something went wrong. Please try again later.");
    }
})

// register
app.post('/register', async (req, res) => {
    const { uId, password, role, name, year, section, dept } = req.body;
    let hash = "";
    try {
        const salt = await bcrypt.genSalt(12);
        hash = await bcrypt.hash(password, salt);
    }
    catch (err) {
        console.log("Hashing Error !", err);
    }
    const user = new User({ uId, hash, role });
    user.save()
        .then(() => {
            if (role === "student") {
                const student = new Student({ name, year, dept, section });
                student.sId = user;
                student.save()
                    .then(() => {
                        res.json("Registered !");
                    })
                    .catch(async (err) => {
                        console.log("Caught an error !", err);
                        console.log("Rollback !!!")
                        await User.findOneAndDelete({ uId })
                        res.status(400).json("Unable to register!");
                    })

            }
            else if (role === "faculty") {
                const faculty = new Faculty({ name, dept });
                faculty.fId = user;
                faculty.save()
                    .then(() => {
                        res.json("Registered !");
                    })
                    .catch(async (err) => {
                        console.log("Caught an error !", err);
                        console.log("Rollback !!!")
                        await User.findOneAndDelete({ uId })
                        res.status(400).json("Unable to register!");
                    })
            }
        })
        .catch((err) => {
            console.log("Caught an error !", err);
            res.status(400).json("Unable to register!");
        })
})
app.listen(3000, () => {
    console.log("Listening on port 3000")
})