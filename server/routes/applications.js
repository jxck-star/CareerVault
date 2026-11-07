import express from 'express';
import { Application } from '../models/Application.js';

const router = express.Router();

// Get all applications (for HR/Admin)
router.get('/', async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId applierId');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get applications by user
router.get('/user/:userId', async (req, res) => {
    try {
        const apps = await Application.find({ applierId: req.params.userId }).populate('jobId applierId');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('[DEBUG] Application POST body:', req.body);
        let app = new Application(req.body);
        await app.save();
        
        // Populate before sending/emitting
        app = await Application.findById(app._id).populate('jobId applierId');

        if (req.io) {
            req.io.emit('application:new', app);
            req.io.emit('stats:update');
        }

        res.status(201).json(app);
    } catch (err) {
        console.error('[ERROR] Application save failed:', err);
        res.status(500).json({ message: err.message, error: err });
    }
});

// Update application status with logging
router.put('/:id/status', async (req, res) => {
    try {
        const { status, note } = req.body;
        let app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        app.status = status;
        // Auto-log status change
        app.updates.push({ 
            status, 
            note: note || `Application moved to ${status}`, 
            updatedAt: new Date() 
        });
        
        await app.save();
        
        // Re-populate for frontend consistency
        app = await Application.findById(app._id).populate('jobId applierId');

        if (req.io) {
            req.io.emit('application:update', app);
            // Also notify the specific user
            req.io.emit(`notification:${app.applierId?._id || app.applierId}`, {
                title: 'Application Update',
                message: `Your application for job ${app.jobId?.title || 'position'} has been moved to ${status}`,
                type: 'info'
            });
        }

        res.json(app);
    } catch (err) {
        console.error('[ERROR] Status update failed:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add custom pipeline update
router.put('/:id/add-update', async (req, res) => {
    try {
        const { status, note } = req.body;
        let app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        app.updates.push({ 
            status: status || app.status, 
            note, 
            updatedAt: new Date() 
        });
        
        await app.save();
        app = await Application.findById(app._id).populate('jobId applierId');

        if (req.io) req.io.emit('application:update', app);

        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assign test to candidate
router.put('/:id/assign-test', async (req, res) => {
    try {
        const { testId } = req.body;
        const app = await Application.findByIdAndUpdate(
            req.params.id,
            { 
                assignedTest: { 
                    testId, 
                    status: 'Pending', 
                    assignedAt: new Date() 
                } 
            },
            { new: true }
        ).populate('jobId applierId');
        
        if (req.io) req.io.emit('application:update', app);

        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Shortlist application
router.put('/:id/shortlist', async (req, res) => {
    try {
        const app = await Application.findByIdAndUpdate(
            req.params.id,
            { shortlisted: req.body.shortlisted },
            { new: true }
        ).populate('jobId applierId');
        
        if (!app) return res.status(404).json({ message: 'Application not found' });

        if (req.io) req.io.emit('application:update', app);

        res.json(app);
    } catch (err) {
        console.error('[ERROR] Shortlist toggle failed:', err);
        res.status(500).json({ message: err.message });
    }
});



export default router;
