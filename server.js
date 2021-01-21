const express = require('express');
// mongoose required to connect to mongodb
const mongoose = require('mongoose');
// bcrypt for hashing passwords
const bcrypt = require('bcrypt');
const cors = require('cors');
const body_parser = require('body-parser')

mongoose.connect('mongodb://localhost/quiz', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("connected")
})
.catch((err) => {
    console.log("error", err)
})

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", userSchema);

const app =  express();

app.use(cors())
app.use(body_parser.json())

let questionnaire = []
let test = "";
let sub = "";

app.get('/quiz', (req, res) => {
    res.json(questionnaire);
})
app.post('/quiz', (req, res) => { 
    const { testName, subject, questions, options, answers } = req.body;
    test =  testName;
    sub = subject;
    questionnaire = []
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
    res.json("Success");
})
app.post('/register', async(req, res) => {
    const {id, email, name, password} = req.body;
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const usr = new User({_id: id, email: email, pass: hash});
    console.log(usr)
    usr.save().then(() => console.log("saved")).catch((err) => console.log("error",err))
    console.log(hash);
    res.json("register!")
})
app.listen(3000)