const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "test name can't be empty"]
    },
    subject: {
        type: String,
        required: [true, "subject name can't be empty"]
    },
    host: {
        // related to faculty id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, "a test can't be organised without a host"]
    },
    questionnaire: {
        type: [{
            id: Number,
            text: {
                type: String,
                required: true
            },
            options: {
                type: Object,
                minlength: 2,
                required: true
            },
            correctOption: {
                type: Number,
                required: true
            }
        }],
        required:[true, "questionnaire can't be empty"]
    },
    year: {
        type: [Number],
        min: [1, "Current year can't be < 1"],
        max: [4, "Current year can't be > 4"],
        required: [true, 'year is necessary']
    },
    dept: {
        type: [String],
        required: [true, 'dept is necessary']
    },
    section: {
        type: [String],
        required: [true, 'section is necessary']
    },
    dateAndTime: {
        type: mongoose.Schema.Types.Date,
        required: true
    }
})
const Test = mongoose.model("Test", testSchema);
module.exports = Test;