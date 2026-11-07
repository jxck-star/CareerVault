import express from 'express';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete job
router.delete('/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        // Also delete related applications
        await Application.deleteMany({ jobId: req.params.id });
        res.json({ message: 'Job and related applications deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
