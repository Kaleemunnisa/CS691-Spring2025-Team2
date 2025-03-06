const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

// Update Profile Route
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, age, gender, height, weight, skinTone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.user, 
            { name, age, gender, height, weight, skinTone }, 
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
