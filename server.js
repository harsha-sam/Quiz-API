const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser')

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
app.listen(3000)