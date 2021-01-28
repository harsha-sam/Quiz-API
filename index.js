const express = require('express');
// mongoose required to connect to mongodb
const mongoose = require('mongoose');
const cors = require('cors');
const body_parser = require('body-parser')
const db = require('./Models');
const { User, Student, Faculty, Response, Test } = db;
const { handleSignIn } = require("./controllers/signin");
const { handleRegister } = require('./controllers/register');
const { getAssessments } = require('./controllers/assessments');
const { handleQuizGet, handleQuizPost } = require('./controllers/quiz');

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


app.post('/signin', handleSignIn(db))
app.post('/register', handleRegister(db))
app.post('/quiz', handleQuizPost(db))
app.get('/quiz/:tId', handleQuizGet(db))
app.post('/assessments', getAssessments(db))

app.listen(3000, () => {
    console.log("Listening on port 3000")
})