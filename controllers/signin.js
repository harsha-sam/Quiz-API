const bcrypt = require('bcrypt');

const handleSignIn = (db) => async (req, res) => {
    const { uId, password } = req.body;
    const { User, Student, Faculty } = db;
    try {
        const usr = await User.findOne({ uId }).exec();
        const result = await bcrypt.compare(password, usr.hash);
        if (result) {
            let data = {}
            if (usr.role === 'student') {
                const stud = await Student.findOne({ sId: usr._id }).populate("sId", '-hash -_id').exec();
                data = { ...stud._doc, ...stud.sId._doc};
                delete data["sId"]
            }
            if (usr.role === 'faculty') {
                const fac = await Faculty.findOne({ fId: usr._id }).populate("fId", '-hash -_id').exec();
                data = { ...fac._doc, ...fac.fId._doc};
                delete data["fId"]
            }
            res.json(data);
        }
        else {
            res.status(400).json("Wrong Password. Please enter correct password to log in.");
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json("Something went wrong. Please try again later.");
    }
}

module.exports = {handleSignIn};