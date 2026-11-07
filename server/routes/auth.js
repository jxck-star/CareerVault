import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_6789';

// Register
router.post('/register', async (req, res) => {
    try {
        let { email, password, name, role, phone, education, careerInterest, company } = req.body;
        
        // Normalize email
        if (email) email = email.toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered. Please login.' });

        const userData = { 
            email, 
            password, 
            name, 
            role: role || 'APPLIER',
            company,
            personal: { phone },
            targetRole: careerInterest
        };


        // If education is a string (from simple reg form), wrap it
        if (education && typeof education === 'string') {
            userData.education = [{ degree: education }];
        }

        const user = new User(userData);
        await user.save();

        // Emit real-time event for Admin
        if (req.io) {
            req.io.emit('user:new', { 
                id: user._id, 
                name: user.name, 
                role: user.role, 
                email: user.email,
                createdAt: user.createdAt 
            });
            req.io.emit('stats:update');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        
        // Normalize email
        if (email) email = email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials. Access denied.' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials. Access denied.' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        // Emit login event (optional but good for real-time visualization)
        if (req.io) {
            req.io.emit('user:login', { id: user._id, name: user.name });
        }

        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

