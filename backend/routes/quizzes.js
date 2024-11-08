// backend/routes/quizzes.js

const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

// Submit Quiz Results
router.post('/submit', authMiddleware, async (req, res) => {
    const { quizType, score } = req.body;

    if (!['freakQuiz', 'brainrotQuiz', 'rizzQuiz'].includes(quizType)) {
        return res.status(400).json({ message: 'Invalid quiz type.' });
    }

    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update quiz score
        user.quizzes[quizType] = score;
        await user.save();

        res.json({ message: 'Quiz score updated successfully.', quizzes: user.quizzes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get All Users for Comparison
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('username quizzes');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add Friend
router.post('/add-friend', authMiddleware, async (req, res) => {
    const { friendId } = req.body;

    if (!friendId) {
        return res.status(400).json({ message: 'Friend ID is required.' });
    }

    try {
        const user = await User.findById(req.user);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found.' });
        }

        // Check if already friends
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Already friends.' });
        }

        user.friends.push(friendId);
        await user.save();

        res.json({ message: 'Friend added successfully.', friends: user.friends });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
