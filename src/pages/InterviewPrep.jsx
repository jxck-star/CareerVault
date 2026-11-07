import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Sparkles, Trophy, Play, Shield, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';

export const InterviewPrep = () => {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const [targetJob, setTargetJob] = useState('Senior Frontend Developer');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const generateQuestions = () => {
        const skills = profile?.skills?.map(s => s.name) || ['React', 'JavaScript', 'Node.js'];
        const mockQuestions = [
            { id: 1, q: `Explain how you would architect a large scale application using ${skills[0] || 'your core stack'}.`, focus: 'System Design', difficulty: 'Hard' },
            { id: 2, q: "Tell me about a time you had to optimize a slow component. What was your process?", focus: 'Performance', difficulty: 'Medium' },
            { id: 3, q: "How do you handle state management across deeply nested modules in dynamic environments?", focus: 'State Management', difficulty: 'Hard' },
            { id: 4, q: "Describe your experience with CI/CD and automated quality assurance.", focus: 'DevOps / QA', difficulty: 'Medium' }
        ];
        setQuestions(mockQuestions);
        setIsStarted(true);
        setIsFinished(false);
        setCurrentIndex(0);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(v => v + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <div className="prep-container animate-fade-in">
                <div className="setup-card glass premium-shadow">
                    <Trophy size={64} className="gold-glow" />
                    <h2>Simulation Complete!</h2>
                    <p>You've successfully addressed the core architectural challenges for <strong>{targetJob}</strong>.</p>
                    <div className="res-grid">
                        <div className="res-stat">
                            <span>Readiness</span>
                            <strong>85%</strong>
                        </div>
                        <div className="res-stat">
                            <span>Clarity</span>
                            <strong>High</strong>
                        </div>
                    </div>
                    <button className="start-btn" onClick={() => setIsStarted(false)}>Back to Terminal</button>
                </div>
                <style>{`
                    .gold-glow { color: #fbbf24; filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4)); margin-bottom: 1.5rem; }
                    .res-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; width: 100%; margin: 2rem 0; }
                    .res-stat { background: var(--bg-main); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border); }
                    .res-stat span { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
                    .res-stat strong { display: block; font-size: 1.5rem; margin-top: 0.5rem; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="prep-container animate-fade-in">
            <div className="section-header">
                <div>
                    <h1><Sparkles size={32} color="var(--primary)" /> AI Interview Coach</h1>
                    <p className="subtitle">Real-time simulation based on your Vault Data</p>
                </div>
            </div>

            {!isStarted ? (
                <div className="setup-card glass premium-shadow">
                    <div className="icon-badge">
                        <Sparkles size={40} color="white" />
                    </div>
                    <h2>Deploy Simulator?</h2>
                    <p>The AI will generate high-fidelity questions tailored to your skills and your target role: <strong>{targetJob}</strong></p>
                    
                    <div className="selector-group">
                        <label>Target Ambition</label>
                        <select value={targetJob} onChange={e => setTargetJob(e.target.value)}>
                            <option>Senior Frontend Developer</option>
                            <option>Full Stack Engineer</option>
                            <option>Product Manager</option>
                            <option>Cloud Architect</option>
                        </select>
                    </div>

                    <button className="start-btn" onClick={generateQuestions}>
                        <Play size={18} fill="white" /> Initiate Session
                    </button>
                </div>
            ) : (
                <div className="session-view glass premium-shadow">
                    <div className="session-progress">
                        <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>

                    <div className="question-content">
                        <div className="q-meta">
                            <span className="metadata-tag focus"><Shield size={14} /> {questions[currentIndex].focus}</span>
                            <span className={`metadata-tag diff ${questions[currentIndex].difficulty}`}>{questions[currentIndex].difficulty}</span>
                        </div>
                        <h2 className="q-text">"{questions[currentIndex].q}"</h2>
                    </div>

                    <div className="coach-brief glass">
                        <div className="brief-head">
                            <MessageCircle size={18} color="var(--primary)" />
                            <h4>Tactical Advice</h4>
                        </div>
                        <p>Leverage the <strong>STAR Framework</strong>. Focus 60% of your time on the **Action** and **Result** to demonstrate measurable impact.</p>
                    </div>

                    <div className="session-controls">
                        <button className="exit-btn" onClick={() => setIsStarted(false)}>Abort Mission</button>
                        <button className="next-btn" onClick={handleNext}>
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finalize Session'} <TrendingUp size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="insights-panel">
                <div className="insight-stat glass">
                    <div className="stat-icon warn"><Trophy size={20} /></div>
                    <div className="stat-data">
                        <span>Communication Level</span>
                        <strong>Elite (Top 5%)</strong>
                    </div>
                </div>
                <div className="insight-stat glass">
                    <div className="stat-icon primary"><AlertCircle size={20} /></div>
                    <div className="stat-data">
                        <span>Optimization Focus</span>
                        <strong>System Scalability</strong>
                    </div>
                </div>
            </div>

            <style>{`
                .prep-container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2.5rem; }
                .subtitle { color: var(--text-muted); font-size: 1.1rem; margin-top: 0.5rem; }
                
                .setup-card { padding: 4rem 3rem; text-align: center; border-radius: var(--radius-lg); border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; background: var(--bg-card); }
                .icon-badge { background: var(--primary); padding: 1.25rem; border-radius: 50%; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4); margin-bottom: 2rem; }
                .setup-card h2 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; }
                .setup-card p { font-size: 1.1rem; color: var(--text-muted); max-width: 600px; line-height: 1.6; }
                
                .selector-group { margin: 2rem 0; width: 100%; max-width: 400px; text-align: left; }
                .selector-group label { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; }
                .selector-group select { width: 100%; padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg-main); font-weight: 600; }
                
                .start-btn { background: var(--bg-dark); color: white; padding: 1rem 3rem; border-radius: var(--radius-md); font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.75rem; transition: var(--transition); border: 2px solid transparent; }
                .start-btn:hover { background: black; transform: translateY(-2px); border-color: var(--primary); }

                .session-view { padding: 0; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border); background: var(--bg-card); position: relative; }
                .session-progress { height: 6px; background: var(--bg-main); width: 100%; }
                .progress-fill { height: 100%; background: var(--primary); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                
                .question-content { padding: 3.5rem; }
                .q-meta { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
                .metadata-tag { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 99px; }
                .metadata-tag.focus { background: rgba(79, 70, 229, 0.1); color: var(--primary); display: flex; align-items: center; gap: 0.4rem; }
                .metadata-tag.diff.Hard { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
                .metadata-tag.diff.Medium { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
                
                .q-text { font-size: 2.25rem; line-height: 1.3; font-weight: 800; color: var(--text-main); }
                
                .coach-brief { margin: 0 3.5rem 3.5rem 3.5rem; padding: 1.5rem; background: var(--bg-main); border-radius: var(--radius-md); border-left: 5px solid var(--primary); }
                .brief-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
                .brief-head h4 { font-weight: 800; font-size: 0.95rem; }
                .coach-brief p { font-size: 0.95rem; color: var(--text-main); line-height: 1.6; }

                .session-controls { display: flex; justify-content: space-between; align-items: center; padding: 2rem 3.5rem; background: var(--bg-main); border-top: 1px solid var(--border); }
                .exit-btn { color: var(--text-muted); font-weight: 700; font-size: 0.95rem; }
                .next-btn { background: var(--primary); color: white; padding: 0.85rem 2rem; border-radius: var(--radius-md); font-weight: 800; display: flex; align-items: center; gap: 0.75rem; }

                .insights-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .insight-stat { padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); background: var(--bg-card); display: flex; align-items: center; gap: 1.25rem; transition: var(--transition); }
                .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .stat-icon.warn { background: rgba(251, 191, 36, 0.1); color: #b45309; }
                .stat-icon.primary { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
                .stat-data span { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
                .stat-data strong { display: block; font-size: 1.1rem; color: var(--text-main); margin-top: 0.25rem; }

                @media (max-width: 768px) {
                    .q-text { font-size: 1.5rem; }
                    .insights-panel { grid-template-columns: 1fr; }
                    .session-view { border-radius: 0; }
                    .question-content { padding: 2rem; }
                }
            `}</style>
        </div>
    );
};
