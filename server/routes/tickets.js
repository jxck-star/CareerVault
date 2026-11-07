import express from 'express';
import { Ticket } from '../models/Ticket.js';

const router = express.Router();

// Get user tickets
router.get('/user/:userId', async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.params.userId });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create ticket
router.post('/', async (req, res) => {
    try {
        console.log('[DEBUG] Ticket POST body:', req.body);
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        console.error('[ERROR] Ticket save failed:', err);
        res.status(500).json({ message: err.message, error: err });
    }
});

// Update ticket (for replies/resolution)
router.put('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
