import express from 'express';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Ticket } from '../models/Ticket.js';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user (admin)
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user (admin)
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Cascading deletes would be good here
        await Application.deleteMany({ applierId: req.params.id });
        await Ticket.deleteMany({ userId: req.params.id });
        res.json({ message: 'User and related data deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get global stats
router.get('/stats', async (req, res) => {
    try {
        const [userCount, jobCount, appCount, ticketCount] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
            Ticket.countDocuments()
        ]);
        res.json({ userCount, jobCount, appCount, ticketCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
