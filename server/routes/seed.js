import express from 'express';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Assessment } from '../models/Assessment.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Clear existing (optional - for development only)
        await User.deleteMany({});
        await Job.deleteMany({});
        await Assessment.deleteMany({});

        // Drop conflicting indexes if they exist
        const dropUuid = async (model) => {
            try {
                await model.collection.dropIndex('uuid_1');
                console.log(`Dropped uuid_1 from ${model.modelName}`);
            } catch (e) {
                // Ignore if doesn't exist
            }
        };

        await dropUuid(User);
        await dropUuid(Job);
        await dropUuid(Assessment);

        const users = [
            { email: 'admin@careervault.com', password: 'admin', role: 'ADMIN', name: 'System Admin' },
            { email: 'hr@google.com', password: 'hr', role: 'HR', name: 'Jane Recruiter', company: 'Google' },
            { email: 'applier@user.com', password: 'user', role: 'APPLIER', name: 'John Doe' },
        ];

        // Using create ensures hooks (password hashing) are triggered
        const createdUsers = await User.create(users);


        // Find the HR user to link jobs
        const hrUser = createdUsers.find(u => u.role === 'HR');
        const hrId = hrUser?._id;

        const jobs = [
            { title: 'Frontend Developer', company: 'Google', hrId, location: 'Remote', salary: '₹12L - ₹18L', type: 'Full-Time', skills: ['React', 'CSS', 'JavaScript', 'TypeScript'], description: 'Build modern user interfaces using React, TypeScript, and design systems.' },
            { title: 'Backend Engineer', company: 'Google', hrId, location: 'London', salary: '₹15L - ₹22L', type: 'Full-Time', skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'], description: 'Design and build scalable backend services and APIs.' },
        ];

        const assessments = [
            { title: 'JavaScript Fundamentals', role: 'Frontend Developer', difficulty: 'Intermediate', duration: '45 min' },
            { title: 'React Component Patterns', role: 'Frontend Developer', difficulty: 'Advanced', duration: '60 min' },
        ];

        await Job.insertMany(jobs);
        await Assessment.insertMany(assessments);

        res.json({ message: 'Database seeded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
