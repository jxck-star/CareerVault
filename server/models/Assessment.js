import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    role: String,
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    questions: [{
        q: String,
        options: [String],
        correct: Number
    }],
    duration: String // e.g. "45 min"
}, { timestamps: true });

export const Assessment = mongoose.model('Assessment', assessmentSchema);
