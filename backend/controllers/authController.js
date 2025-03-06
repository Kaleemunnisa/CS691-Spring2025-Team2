const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// User Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, age, gender, height, weight, skinTone } = req.body;
        
        // Log the request body to see what's being received
        console.log("Registration attempt with data:", req.body);

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Convert string values to numbers for numeric fields
        const userData = { 
            name, 
            email, 
            password: hashedPassword,
            age: Number(age),
            gender, 
            height: height ? Number(height) : undefined, 
            weight: weight ? Number(weight) : undefined, 
            skinTone 
        };
        
        console.log("Creating user with data:", userData);
        
        // Create user object
        user = new User(userData);

        // Attempt to save and log any validation errors
        try {
            const savedUser = await user.save();
            console.log("User saved successfully:", savedUser._id);
            
            // Generate token for the new user
            const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            // Return token with success message to enable auto-login
            res.status(201).json({ 
                message: 'User registered successfully',
                token,
                user: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email
                }
            });
        } catch (validationError) {
            console.error("MongoDB validation error:", validationError);
            return res.status(400).json({ 
                message: 'Validation error', 
                details: validationError.message 
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Login successful for user:", user._id);

        // Set cookie with more permissive settings for development
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'lax'  // More permissive for development
        });
        
        // Return user data that includes necessary profile information
        res.json({ 
            message: 'Login successful', 
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                skinTone: user.skinTone
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, age, gender, height, weight, skinTone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.user, 
            { 
                name, 
                age: Number(age), 
                gender, 
                height: height ? Number(height) : undefined, 
                weight: weight ? Number(weight) : undefined, 
                skinTone 
            }, 
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};