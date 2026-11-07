import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);
