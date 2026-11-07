import express from 'express';
import { Notification } from '../models/Notification.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(10);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const notif = new Notification(req.body);
        await notif.save();
        res.status(201).json(notif);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
