// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    quizzes: {
        freakQuiz: {
            type: Number,
            default: 0,
        },
        brainrotQuiz: {
            type: Number,
            default: 0,
        },
        rizzQuiz: {
            type: Number,
            default: 0,
        },
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
