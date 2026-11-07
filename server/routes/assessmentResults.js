import express from 'express';
import { AssessmentResult } from '../models/AssessmentResult.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
    try {
        const results = await AssessmentResult.find({ userId: req.params.userId }).populate('testId');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = new AssessmentResult(req.body);
        await result.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
