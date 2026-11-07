import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, BookOpen, Target, TrendingUp, AlertCircle, Lightbulb, Zap } from 'lucide-react';

const RECOMMENDATION_ENGINE = {
    'Frontend': {
        skills: ['Tailwind CSS', 'Redux Toolkit', 'Next.js', 'Testing Library', 'TypeScript'],
        courses: ['Advanced React Patterns', 'Modern CSS with Tailwind', 'Next.js 14 Complete Guide'],
        roadmap: ['Build a Portfolio', 'Contribute to Open Source', 'Learn Web Vitals Optimization']
    },
    'Backend': {
        skills: ['Docker', 'Kubernetes', 'Redis', 'PostgreSQL', 'Microservices Architecture'],
        courses: ['Node.js Backend Architecture', 'SQL & NoSQL Database Design', 'Docker & Kubernetes Masterclass'],
        roadmap: ['System Design Practice', 'API Documentation (Swagger)', 'Cloud Deployment (AWS/Azure)']
    },
    'Cyber Security': {
        skills: ['Penetration Testing', 'Network Security', 'Ethical Hacking', 'SIEM Tools', 'Cryptography'],
        courses: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'Practical Network Pentesting'],
        roadmap: ['Set up a Homelab', 'Participate in CTFs', 'Get CompTIA Certified']
    },
    'General': {
        skills: ['Communication', 'Agile/Scrum', 'Git/GitHub', 'Problem Solving'],
        courses: ['Soft Skills for Developers', 'Git Mastery', 'System Design Fundamentals'],
        roadmap: ['Network on LinkedIn', 'Improve English Proficiency', 'Build a Side Project']
    }
};

export const AIRecommendations = ({ profile }) => {
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!profile) return;
        
        setLoading(true);
        // Simulate AI analysis delay
        const timer = setTimeout(() => {
            const role = profile.professionalRole || 'Frontend'; // Default or extracted
            const pool = RECOMMENDATION_ENGINE[role] || RECOMMENDATION_ENGINE['General'];
            
            // Filter out skills user already has
            const possessedSkills = new Set((profile.skills || []).map(s => s.name?.toLowerCase()).filter(Boolean));
            const missingSkills = pool.skills.filter(s => !possessedSkills.has(s.toLowerCase()));

            setSuggestions({
                role,
                missingSkills,
                courses: pool.courses,
                roadmap: pool.roadmap
            });
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [profile]);

    if (loading) return (
        <div className="ai-loading glass">
            <Sparkles className="spin" color="var(--primary)" size={32} />
            <p>AI Engine analyzing your profile gap...</p>
        </div>
    );

    if (!suggestions) return null;

    return (
        <div className="ai-recs-container animate-fade-in">
            <div className="ai-card glass primary-border">
                <div className="card-header">
                    <Zap size={24} className="icon-pulse" />
                    <h3>Career Intelligence</h3>
                </div>
                
                <div className="analysis-grid">
                    <div className="analysis-section">
                        <h4><Target size={18} /> Skill Gap Analysis</h4>
                        <p className="text-muted">Based on your interest in <strong>{suggestions.role}</strong>, consider adding:</p>
                        <div className="skill-tags">
                            {suggestions.missingSkills.map(s => (
                                <span key={s} className="skill-tag suggested">{s}</span>
                            ))}
                        </div>
                    </div>

                    <div className="analysis-section">
                        <h4><BookOpen size={18} /> Recommended Learning</h4>
                        <ul className="rec-list">
                            {suggestions.courses.map((course, i) => (
                                <li key={i}><Lightbulb size={14} /> {course}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="analysis-section full-width">
                        <h4><TrendingUp size={18} /> Smart Career Roadmap</h4>
                        <div className="roadmap-steps">
                            {suggestions.roadmap.map((step, i) => (
                                <div key={i} className="roadmap-step">
                                    <div className="step-num">{i + 1}</div>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ai-recs-container { margin-top: 2rem; }
                .primary-border { border: 1px solid var(--primary) !important; box-shadow: 0 0 15px rgba(79, 70, 229, 0.1); }
                .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; color: var(--primary); }
                .card-header h3 { font-size: 1.25rem; font-weight: 700; margin: 0; }
                .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .analysis-section h4 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 1rem; }
                .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
                .skill-tag.suggested { background: rgba(79, 70, 229, 0.1); color: var(--primary); border: 1px dashed var(--primary); }
                .rec-list { list-style: none; padding: 0; }
                .rec-list li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-main); }
                .roadmap-steps { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
                .roadmap-step { flex: 1; min-width: 150px; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.5rem; }
                .step-num { width: 24px; height: 24px; background: var(--primary); color: white; border-radius: 50%; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
                .roadmap-step p { font-size: 0.85rem; font-weight: 600; margin: 0; }
                
                .ai-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 1rem; text-align: center; }
                .icon-pulse { animation: icon-pulse 2s infinite; }
                @keyframes icon-pulse { 0% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.6; transform: scale(1); } }

                @media (max-width: 600px) {
                    .analysis-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};
