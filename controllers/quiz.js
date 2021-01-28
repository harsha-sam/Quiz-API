const handleQuizGet = (db) => async(req, res) => {
    const { Test } = db;
    const { tId } = req.params;
    try {
        const questionnaire = await Test.findById(tId, ('questionnaire -_id')).exec();
        res.json(questionnaire);
    }
    catch (err) {
        res.status(400).json("Something went wrong. Please try again later.");
    }
}

const handleQuizPost = (db) => async (req, res) => {
    const { Test } = db;
    const { testName,
        subject,
        host,
        questions,
        options,
        answers,
        year,
        dept,
        section,
        startDateAndTime,
        endDateAndTime } = req.body;
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
        section, startDateAndTime, endDateAndTime });
    try {
        const t = await test.save();
        res.json("Success!");
    }
    catch (err) {
        console.log(err);
        res.status(400).json("Something went wrong !");
    }
}
module.exports = {handleQuizPost, handleQuizGet}