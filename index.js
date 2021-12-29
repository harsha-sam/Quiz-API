require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express');
// mongoose required to connect to mongodb
const mongoose = require('mongoose');
const cors = require('cors');
const body_parser = require('body-parser')
const db = require('./models');
const { handleSignIn } = require("./controllers/signin");
const { handleRegister } = require('./controllers/register');
const { getAssessments } = require('./controllers/assessments');
const { handleQuizGet, handleQuizPost } = require('./controllers/quiz');
const { handlePostResponse } = require('./controllers/response');
mongoose.connect(process.env.mongodb_cluster_url,{
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

app.get('/', (req, res) => {
    res.send("Hello !")
})
app.post('/signin', handleSignIn(db))
app.post('/register', handleRegister(db))
app.post('/quiz', handleQuizPost(db))
app.get('/quiz/:tId', handleQuizGet(db))
app.post('/assessments', getAssessments(db))
app.post('/response', handlePostResponse(db))

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT || 3000}`)
})