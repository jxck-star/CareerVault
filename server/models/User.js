import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['APPLIER', 'HR', 'ADMIN'], default: 'APPLIER' },
    company: String,
    personal: {
        phone: String,
        address: String,
        bio: String,
        linkedin: String,
        portfolio: String
    },
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        grade: String
    }],
    experience: [{
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String
    }],
    skills: [{
        name: String,
        level: String
    }],
    certifications: [{
        name: String,
        organization: String,
        date: String
    }],
    resumeUrl: String,
    targetRole: String
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);

