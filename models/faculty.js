const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    fId: {
        // same as in user table
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: [true, 'id is necessary']
    },
    name: {
        type: String,
        required: [true, 'name is necessary']
    },
    dept: {
        type: String,
        enum: ['CSE', 'ECE', 'IT', 'EEE', 'MECH', 'CE'],
        required: [true, 'dept is necessary']
    }
})
const Faculty = mongoose.model("Faculty", facultySchema);
module.exports = Faculty;