import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Rocket, CheckCircle2, Bookmark, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { calculateMatchScore } from '../utils/matchingEngine';

export const CareerRoadmap = () => {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const [targetRole, setTargetRole] = useState('Senior Frontend Developer');

    const courses = []; // Placeholder for courses until Course API is ready

    const generateRoadmap = () => {
        if (!profile) return null;
        
        // Dynamic Job Profile based on target
        const jobProfiles = {
            'Senior Frontend Developer': { skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'Testing', 'Redux'] },
            'Full Stack Engineer': { skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Next.js'] },
            'Data Scientist': { skills: ['Python', 'SQL', 'Machine Learning', 'Stats', 'Pandas', 'Spark'] },
            'DevOps Engineer': { skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Linux'] }
        };

        const currentProfile = jobProfiles[targetRole] || jobProfiles['Senior Frontend Developer'];
        const match = calculateMatchScore(profile, currentProfile);

        // Find relevant courses from DB
        const relevantCourses = courses?.filter(c =>
            c.skills?.some(s => match.missing.map(m => m.toLowerCase()).includes(s.toLowerCase()))
        ) || [];

        const weeks = [
            { 
                week: 1, 
                focus: "Closing " + (match.missing[0] || "Foundational") + " Gaps", 
                tasks: [
                    "Master core concepts of " + (match.missing[0] || "Architecture"),
                    relevantCourses[0] ? `Finish Course: ${relevantCourses[0].title}` : "Practical Lab: Implementation",
                    "Take Level 1 Skills Assessment"
                ] 
            },
            { 
                week: 2, 
                focus: (match.missing[1] || "Advanced") + " Mastery", 
                tasks: [
                    "Build a complex feature using " + (match.missing[1] || "Design Patterns"),
                    relevantCourses[1] ? `Start Course: ${relevantCourses[1].title}` : "System Design Workshop",
                    "Peer Review / Code Audit Session"
                ] 
            },
            { 
                week: 3, 
                focus: "Performance & Scaling", 
                tasks: [
                    "Optimization techniques for " + targetRole, 
                    "Implement monitoring and logging",
                    "Technical Mock Interview"
                ] 
            },
            { 
                week: 4, 
                focus: "Career Leap & Portfolio", 
                tasks: [
                    "Finalize capstone project highlighting " + (match.missing[0] || "Skills"),
                    "Resume sync with CareerVault AI",
                    "Apply to 5 High-Match jobs"
                ] 
            }
        ];
        return { role: targetRole, weeks, match };
    };

    const roadmap = generateRoadmap();

    if (profileLoading) return (
        <div className="loading-state">
            <span className="loader"></span>
            <p>Analyzing profile and market trends...</p>
        </div>
    );
    
    if (!profile || !roadmap) return (
        <div className="empty-roadmap glass">
            <Rocket size={64} className="icon-bounce" />
            <h2>Unlock Your Roadmap</h2>
            <p>Please complete your personal profile to let AI calculate your career trajectory.</p>
            <button className="save-btn" onClick={() => window.location.href='/profile'}>Go to Profile</button>
        </div>
    );

    const roleOptions = [
        'Senior Frontend Developer',
        'Full Stack Engineer',
        'Data Scientist',
        'DevOps Engineer',
        'Cloud Architect',
        'Mobile Developer'
    ];

    return (
        <div className="roadmap-page animate-fade-in">
            <div className="roadmap-header-section premium-card">
                <div className="header-content">
                    <div className="brand-badge"><Rocket size={16} /> Career Vault PRECISION PATH</div>
                    <h1>Career Acceleration Roadmap</h1>
                    <p>Strategic skill acquisition blueprint for <strong>{user.name}</strong></p>
                    
                    <div className="roadmap-meta">
                        <div className="target-selector">
                            <label>Target Ambition</label>
                            <select value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                                {roleOptions.map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="sync-status">
                            <div className="pulse-dot"></div>
                            AI Synced: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
                
                <div className="match-visual-box">
                    <div className="match-percentage">
                        <svg viewBox="0 0 100 100" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={`${roadmap.match.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="percentage-text">
                            <span className="num">{roadmap.match.score}%</span>
                            <span className="lab">MATCH</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="roadmap-timeline-pro">
                {roadmap.weeks.map((week, idx) => (
                    <div key={idx} className={`timeline-phase ${idx === 0 ? 'current' : ''}`}>
                        <div className="phase-indicator">
                            <div className="phase-node">
                                {idx === 0 ? <Zap size={20} fill="currentColor" /> : <span>{week.week}</span>}
                            </div>
                            <div className="phase-line"></div>
                        </div>
                        
                        <div className="phase-card premium-card">
                            <div className="phase-header">
                                <div className="phase-title">
                                    <span className="phase-tag">WEEK {week.week} • {idx === 0 ? 'ACTIVE FOCUS' : 'UPCOMING'}</span>
                                    <h3>{week.focus}</h3>
                                </div>
                                {idx === 0 && <div className="status-pill">In Progress</div>}
                            </div>
                            
                            <ul className="task-list">
                                {week.tasks.map((task, tidx) => (
                                    <li key={tidx} className="task-node">
                                        <div className="check-box">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <span className="task-text">{task}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="phase-actions">
                                <button className="btn-secondary"><Bookmark size={16} /> Save for Later</button>
                                {idx === 0 ? (
                                    <button className="btn-primary">Complete Week <ArrowRight size={16} /></button>
                                ) : (
                                    <button className="btn-secondary" disabled>Locked Phase</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .roadmap-page { display: flex; flex-direction: column; gap: 3rem; max-width: 1100px; margin: 0 auto; }
                
                .roadmap-header-section {
                    padding: 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    position: relative;
                    overflow: hidden;
                }
                .roadmap-header-section::after {
                    content: '';
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 200px;
                    height: 200px;
                    background: var(--primary-light);
                    border-radius: 50%;
                    opacity: 0.1;
                    filter: blur(40px);
                }

                .brand-badge { background: var(--primary); color: white; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 1.5rem; }
                .header-content h1 { font-size: 2.8rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 0.5rem; }
                .header-content p { font-size: 1.2rem; color: var(--text-muted); font-weight: 600; margin-bottom: 2rem; }
                
                .roadmap-meta { display: flex; align-items: center; gap: 2.5rem; }
                .target-selector label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-light); text-transform: uppercase; margin-bottom: 0.5rem; }
                .target-selector select { 
                    background: white; 
                    border: 2px solid var(--border); 
                    padding: 0.75rem 1.25rem; 
                    border-radius: var(--radius-md); 
                    font-weight: 700; 
                    color: var(--text-main);
                    cursor: pointer;
                    transition: var(--transition);
                }
                .target-selector select:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px var(--primary-light); }

                .sync-status { display: flex; align-items: center; gap: 0.6rem; color: var(--success); font-size: 0.85rem; font-weight: 700; }
                .pulse-dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; animation: pulse-green 2s infinite; }
                @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

                .match-visual-box { width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; position: relative; }
                .circular-chart { width: 100%; height: 100%; transform: rotate(-90deg); }
                .circle-bg { fill: none; stroke: #f1f5f9; stroke-width: 3; }
                .circle { fill: none; stroke: var(--primary); stroke-width: 3; stroke-linecap: round; transition: stroke-dasharray 1s ease; }
                .percentage-text { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
                .percentage-text .num { font-size: 2rem; font-weight: 950; color: var(--text-main); line-height: 1; }
                .percentage-text .lab { font-size: 0.65rem; font-weight: 850; color: var(--text-light); letter-spacing: 1px; }

                .roadmap-timeline-pro { display: flex; flex-direction: column; padding-left: 3.5rem; }
                .timeline-phase { display: flex; gap: 3rem; position: relative; }
                .phase-indicator { display: flex; flex-direction: column; align-items: center; position: absolute; left: -3.5rem; top: 0; bottom: 0; }
                .phase-node { 
                    width: 54px; 
                    height: 54px; 
                    background: white; 
                    border: 4px solid var(--border); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: 900; 
                    color: var(--text-light); 
                    z-index: 10; 
                    transition: var(--transition);
                }
                .current .phase-node { background: var(--primary); border-color: var(--primary-light); color: white; transform: scale(1.15); box-shadow: var(--shadow-lg); }
                .phase-line { width: 4px; flex: 1; background: var(--border); margin: 8px 0; border-radius: 2px; }
                .timeline-phase:last-child .phase-line { display: none; }

                .phase-card { width: 100%; padding: 2.5rem; margin-bottom: 3.5rem; transition: var(--transition); }
                .current .phase-card { border-color: var(--primary-light); box-shadow: var(--shadow-xl); transform: translateX(10px); }
                
                .phase-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .phase-tag { font-size: 0.75rem; font-weight: 850; color: var(--primary); letter-spacing: 1px; display: block; margin-bottom: 0.5rem; }
                .phase-title h3 { font-size: 1.6rem; font-weight: 850; color: var(--text-main); }
                .status-pill { background: var(--success); color: white; font-size: 0.7rem; font-weight: 800; padding: 0.4rem 1rem; border-radius: 30px; }

                .task-list { list-style: none; display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2.5rem; }
                .task-node { display: flex; align-items: flex-start; gap: 1rem; }
                .check-box { color: var(--success); opacity: 0.4; padding-top: 0.2rem; }
                .current .check-box { opacity: 1; }
                .task-text { font-size: 1.05rem; font-weight: 600; color: var(--text-main); }

                .phase-actions { display: flex; gap: 1rem; padding-top: 2rem; border-top: 1px solid var(--border); }
                .phase-actions button { font-weight: 800; font-size: 0.9rem; }

                @media (max-width: 900px) {
                    .roadmap-header-section { flex-direction: column; text-align: center; gap: 2rem; }
                    .roadmap-meta { flex-direction: column; gap: 1.5rem; }
                    .roadmap-timeline-pro { padding-left: 0; }
                    .phase-indicator { display: none; }
                    .phase-card { margin-left: 0; }
                    .current .phase-card { transform: none; }
                }
            `}</style>
        </div>
    );
};
