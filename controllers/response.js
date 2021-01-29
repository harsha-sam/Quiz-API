const handlePostResponse = (db) => async(req, res) => {
    const { Response } = db;
    const { sId, tId, choices, securedScore } = req.body;
    const resp = new Response({sId, tId, securedScore, choices})
    try{
        const doc = await resp.save()
        res.json("Successfully posted !");
    }
    catch(err){
        console.log(err);
        res.status(400).json("Error, Could n't post")
    }
}
module.exports = { handlePostResponse }