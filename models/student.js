const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    sId: {
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
    year: {
        type: Number,
        min: [1, "Current year can't be < 1"],
        max: [4, "Current year can't be > 4"],
        required: [true, 'year is necessary']
    },
    dept: {
        type: String,
        enum: ['CSE', 'ECE', 'IT', 'EEE', 'MECH', 'CE'],
        required: [true, 'dept is necessary']
    },
    section: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: [true, 'section is necessary']
    }
})
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;