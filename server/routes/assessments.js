import express from 'express';
import { Assessment } from '../models/Assessment.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create assessment
router.post('/', async (req, res) => {
    try {
        const assessment = new Assessment(req.body);
        await assessment.save();
        res.status(201).json(assessment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete assessment
router.delete('/:id', async (req, res) => {
    try {
        await Assessment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Assessment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
