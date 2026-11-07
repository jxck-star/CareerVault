import React, { useState, useEffect } from 'react';
import { jobApi, applicationApi, notificationApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { calculateMatchScore } from '../utils/matchingEngine';
import { Briefcase, Target, BookOpen, ChevronRight, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

export const JobMatches = () => {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await jobApi.getAll();
                setJobs(res.data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const matches = (profile && jobs && jobs.length > 0)
        ? jobs.map(job => ({
            ...job,
            match: calculateMatchScore(profile, job)
        })).sort((a, b) => b.match.score - a.match.score)
        : [];

    const handleApply = async (job) => {
        try {
            const userId = user?._id || user?.id;
            const existingRes = await applicationApi.getByUser(userId);
            const isDuplicate = existingRes.data.some(app => {
                // Handle both populated and non-populated jobId
                const appId = (app.jobId?._id || app.jobId?.id || app.jobId)?.toString();
                const targetId = (job.id || job._id)?.toString();
                return appId === targetId;
            });
            if (isDuplicate) {
                alert('You have already applied to this job!');
                return;
            }
            await applicationApi.apply({
                jobId: job.id,
                applierId: userId,
                status: 'Applied'
            });
            
            await notificationApi.create({
                userId: user.id,
                title: 'Application Submitted',
                message: `You applied to ${job.title} at ${job.company}`,
                type: 'success'
            });
            
            alert(`Applied to ${job.title}!`);
        } catch (err) {
            console.error("Application error:", err);
            alert("Failed to submit application");
        }
    };

    if (profileLoading || loading) return <div>Analyzing matches...</div>;

    return (
        <div className="matches-page animate-fade-in">
            <div className="page-header-section">
                <div>
                    <h1>AI Career Matching</h1>
                    <p>Intelligent job synchronization based on your dynamic professional profile</p>
                </div>
                <div className="header-badge">
                    <Zap size={18} /> Powered by Career Vault AI
                </div>
            </div>

            {matches.length === 0 ? (
                <div className="premium-card empty-state-card">
                    <div className="empty-icon"><Briefcase size={48} /></div>
                    <h3>Enhance Your Profile for Matches</h3>
                    <p>Our AI needs more data to find your perfect career match. Add more skills and experience to unlock recommendations.</p>
                </div>
            ) : (
                <div className="matches-grid">
                    {matches.map((job, idx) => (
                        <div key={job.id || idx} className="job-match-card premium-card">
                            <div className="card-top">
                                <div className="match-visual">
                                    <div className="match-circle" style={{ 
                                        '--percentage': job.match.score,
                                        borderColor: job.match.score > 80 ? '#22c55e' : job.match.score > 60 ? '#f59e0b' : '#ef4444'
                                    }}>
                                        <span className="score-num">{job.match.score}%</span>
                                        <span className="score-label">Match</span>
                                    </div>
                                </div>
                                <div className="job-core-info">
                                    <div className="job-title-row">
                                        <h3>{job.title}</h3>
                                        {job.match.score > 85 && <span className="hot-badge">High Fit</span>}
                                    </div>
                                    <p className="company-info">{job.company} • <strong>{job.location}</strong></p>
                                    <div className="salary-tag">{job.salary || 'Competitive Salary'}</div>
                                    <div className="skill-tags">
                                        {job.skills.slice(0, 5).map(s => (
                                            <span key={s} className={`skill-pill ${job.match.matched.includes(s.toLowerCase()) ? 'matched' : ''}`}>
                                                {s}
                                            </span>
                                        ))}
                                        {job.skills.length > 5 && <span className="more-count">+{job.skills.length - 5} more</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="analysis-box">
                                <div className="analysis-header">
                                    <Target size={16} />
                                    <span>AI Match Rationale</span>
                                    <span className="confidence-label">Confidence: {job.match.confidence}</span>
                                </div>
                                <p className="reason-text">{job.match.reason}</p>

                                {job.match.missing.length > 0 && (
                                    <div className="gap-indicator">
                                        <div className="gap-title">
                                            <AlertTriangle size={14} /> Potential Skill Gaps
                                        </div>
                                        <div className="gap-tags">
                                            {job.match.missing.map(s => <span key={s} className="gap-pill">{s}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer-actions">
                                <div className="upskill-notice">
                                    <BookOpen size={16} />
                                    <span>Recommended: <strong>{job.match.missing[0] || 'Leadership'} Mastery</strong> course</span>
                                </div>
                                <button className="btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => handleApply(job)}>
                                    Quick Apply <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .matches-page { display: flex; flex-direction: column; gap: 2.5rem; }
                .page-header-section { display: flex; justify-content: space-between; align-items: flex-start; }
                .page-header-section h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1px; }
                .page-header-section p { color: var(--text-muted); font-weight: 600; }
                
                .header-badge { background: #eff6ff; color: #3b82f6; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }

                .empty-state-card { padding: 4rem; text-align: center; max-width: 600px; margin: 2rem auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
                .empty-icon { width: 80px; height: 80px; background: #f1f5f9; color: var(--text-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; }

                .matches-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                .job-match-card { padding: 2.5rem; }
                .card-top { display: flex; gap: 2.5rem; align-items: flex-start; }
                
                .match-circle { width: 90px; height: 90px; border-radius: 50%; border: 6px solid; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
                .score-num { font-size: 1.5rem; font-weight: 900; color: var(--text-main); line-height: 1; }
                .score-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-light); }

                .job-core-info { flex: 1; }
                .job-title-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
                .job-title-row h3 { font-size: 1.5rem; font-weight: 800; }
                .hot-badge { background: #fef2f2; color: #ef4444; font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 30px; }

                .company-info { font-size: 1rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 600; }
                .salary-tag { color: var(--success); font-weight: 800; font-size: 0.95rem; margin-bottom: 1rem; }

                .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skill-pill { font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; background: #f1f5f9; color: #64748b; border-radius: 30px; }
                .skill-pill.matched { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
                .more-count { font-size: 0.75rem; color: var(--text-light); font-weight: 700; padding-top: 0.3rem; }

                .analysis-box { background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin: 1.5rem 0; }
                .analysis-header { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; }
                .confidence-label { margin-left: auto; color: var(--primary); font-weight: 800; }
                .reason-text { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }

                .gap-indicator { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
                .gap-title { font-size: 0.8rem; font-weight: 800; color: #dc2626; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
                .gap-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .gap-pill { font-size: 0.7rem; font-weight: 800; background: #fef2f2; color: #dc2626; padding: 0.1rem 0.5rem; border-radius: 4px; }

                .card-footer-actions { display: flex; justify-content: space-between; align-items: center; }
                .upskill-notice { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }
                .upskill-notice strong { color: var(--primary); }

                @media (max-width: 768px) {
                    .card-top { flex-direction: column; }
                    .card-footer-actions { flex-direction: column; gap: 1rem; text-align: center; }
                }
            `}</style>
        </div>
    );
};
