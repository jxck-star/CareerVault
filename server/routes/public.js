import express from 'express';
import { Job } from '../models/Job.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const [jobCount, userCount] = await Promise.all([
            Job.countDocuments(),
            User.countDocuments()
        ]);
        res.json({
            jobs: jobCount,
            users: userCount,
            courses: 12 // Placeholder for courses as it's not in DB yet
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
