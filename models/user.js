const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uId: {
        type: String,
        unique: true,
        required: [true, 'id is necessary']
    },
    name: {
        type: String,
        required: [true, 'name is necessary']
    },
    hash: {
        type: String,
        required: [true, 'pass is necessary']
    },
    role: {
        type: String,
        enum: ['student', 'faculty'],
        required: [true, 'role is necessary']
    }
})
const User = mongoose.model("User", userSchema);
module.exports = User;