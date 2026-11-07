import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import profileRoutes from './routes/profiles.js';
import applicationRoutes from './routes/applications.js';
import assessmentRoutes from './routes/assessments.js';
import assessmentResultRoutes from './routes/assessmentResults.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import notificationRoutes from './routes/notifications.js';
import seedRoutes from './routes/seed.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Inject io into request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/assessment-results', assessmentResultRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/seed', seedRoutes);

app.get('/', (req, res) => {
    res.send('CareerVault API is running with Real-Time Support...');
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Real-Time Enabled)`);
    });
}

export default app;

