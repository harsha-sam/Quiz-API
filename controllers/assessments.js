const getAssessments = (db) => async (req, res) => {
    const { Test, Response, uId } = db;
    const { year, dept, section, sId } = req.body;
    const tests = await Test.find({ year: { $in: year }, 
        dept: { $in : dept}, section: { $in: section}, 
        $and: [{startDateAndTime: { $lte: new Date() }}, 
            {endDateAndTime: { $gt : new Date() }}]});
    res.json(tests);
}
module.exports = {getAssessments};