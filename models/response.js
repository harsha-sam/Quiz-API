const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    sId: {
        // related to student Id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    tId: {
        // related to test Id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    choices: {
        type: [Number],
        required: true
    },
    securedScore: {
        type: Number,
        min: 0,
        required: true
    }
})
responseSchema.index({sId: 1, tId: 1}, {unique: true});
const Response = mongoose.model("Response", responseSchema);
module.exports = Response;