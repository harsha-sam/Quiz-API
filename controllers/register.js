const bcrypt = require('bcrypt');

const handleRegister = (db) => async (req, res) => {
    const { Student, Faculty, User } = db;
    const { uId,
        name,
        password,
        role,
        year,
        section,
        dept } = req.body;
    let hash = "";
    try {
        const salt = await bcrypt.genSalt(12);
        hash = await bcrypt.hash(password, salt);
    }
    catch (err) {
        console.log("Hashing Error !", err);
    }
    const user = new User({ uId, name, hash, role });
    user.save()
        .then(() => {
            if (role === "student") {
                const student = new Student({ year, dept, section });
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
                const faculty = new Faculty({ dept });
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
}

module.exports = { handleRegister } 