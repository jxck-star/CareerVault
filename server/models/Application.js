import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Applied', 'Review', 'Interviewing', 'Offered', 'Rejected', 'Closed'], default: 'Applied' },
    shortlisted: { type: Boolean, default: false },
    updates: [{
        status: String,
        note: String,
        updatedAt: { type: Date, default: Date.now }
    }],
    assignedTest: {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
        status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Evaluated'], default: 'Pending' },
        score: Number,
        assignedAt: { type: Date }
    },
    appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);
