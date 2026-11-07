import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    salary: String,
    type: String,
    skills: [String],
    description: String,
    active: { type: Boolean, default: true }
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
