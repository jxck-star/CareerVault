import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Get all appliers (for HR/Admin)
router.get('/type/applier', async (req, res) => {
    try {
        const appliers = await User.find({ role: 'APPLIER' });
        res.json(appliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get profile
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile
router.put('/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
