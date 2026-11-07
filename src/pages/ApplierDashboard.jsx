import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { jobApi, applicationApi, notificationApi } from '../db/api';
import { calculateMatchScore } from '../utils/matchingEngine';
import { io } from 'socket.io-client';
import {
    LayoutDashboard, Briefcase, ListChecks,
    Target, Zap, Clock, ChevronRight, TrendingUp, AlertCircle, Rocket, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const ApplierDashboard = () => {
    const { profile, loading: profileLoading, error } = useProfile();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [assessmentResults, setAssessmentResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashData = async () => {
        const userId = profile?._id || profile?.id;
        if (!userId) return;
        try {
            const [jobsRes, appsRes, notifsRes] = await Promise.all([
                jobApi.getAll(),
                applicationApi.getByUser(userId),
                notificationApi.getByUser(userId)
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
            setNotifications(notifsRes.data);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashData();

        const userId = profile?._id || profile?.id;
        if (!userId) return;

        const socket = io(SOCKET_URL);
        
        socket.on(`notification:${userId}`, (notif) => {
            console.log('Real-time notification received:', notif);
            setNotifications(prev => [notif, ...prev]);
        });

        socket.on('application:update', (updatedApp) => {
            if (updatedApp.applierId === userId || updatedApp.applierId?._id === userId) {
                setApplications(prev => prev.map(a => a._id === updatedApp._id ? updatedApp : a));
            }
        });

        return () => socket.disconnect();
    }, [profile?._id, profile?.id]);


    if (profileLoading || loading) return (
        <div className="dashboard-loading">
            <div className="pulse-loader"></div>
            <p>Loading Your Profile...</p>
        </div>
    );


    const calculateSecurityScore = () => {
        if (!profile) return 0;
        let filled = 0;
        let total = 6;
        if (profile.name && profile.personal?.phone) filled++;
        if (profile.education?.length > 0) filled++;
        if (profile.experience?.length > 0) filled++;
        if (profile.skills?.length > 0) filled++;
        if (profile.certifications?.length > 0) filled++;
        if (profile.resumeUrl) filled++;
        return Math.round((filled / total) * 100);
    };

    const avgAssessmentScore = assessmentResults?.length 
        ? Math.round(assessmentResults.reduce((acc, curr) => acc + curr.score, 0) / assessmentResults.length)
        : 0;

    const securityScore = calculateSecurityScore();
    const rankedMatches = (profile && jobs)
        ? jobs.map(j => ({ ...j, match: calculateMatchScore(profile, j) }))
            .sort((a, b) => b.match.score - a.match.score)
            .slice(0, 3)
        : [];

    const activeApps = applications?.filter(a => a.status !== 'Closed').length || 0;

    return (
        <div className="applier-dashboard animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, <span className="text-primary">{profile?.name || 'Candidate'}</span></p>
                </div>
                <div className="system-status">
                    <div className="status-indicator">
                        <div className="status-dot online"></div>
                        <span>Status: Online</span>
                    </div>
                </div>

            </header>

            <div className="stats-grid">
                <div className="stats-card premium-card">
                    <div className="stats-icon primary"><Target size={24} /></div>
                    <div className="label">Profile Readiness</div>
                    <div className="value">{securityScore}%</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${securityScore}%` }}></div>
                    </div>
                </div>

                <div className="stats-card premium-card">
                    <div className="stats-icon secondary"><TrendingUp size={24} /></div>
                    <div className="label">Avg. Skill Score</div>
                    <div className="value">{avgAssessmentScore}%</div>
                    <Link to="/assessments" className="card-link">View Analysis <ChevronRight size={14} /></Link>
                </div>

                <div className="stats-card premium-card">
                    <div className="stats-icon success"><ListChecks size={24} /></div>
                    <div className="label">Active Applications</div>
                    <div className="value">{activeApps}</div>
                    <Link to="/my-applications" className="card-link">Track Pipeline <ChevronRight size={14} /></Link>
                </div>
            </div>

            <div className="dash-layout">
                <div className="main-content-feed">
                    <section className="feed-section premium-card">
                        <div className="section-header-compact">
                            <h3><Zap size={18} /> High-Confidence Matches</h3>
                            <Link to="/jobs" className="btn-text">View All Jobs</Link>
                        </div>
                        <div className="match-grid">
                            {rankedMatches.length > 0 ? rankedMatches.map((m, idx) => (
                                <div key={idx} className="match-item">
                                    <div className="match-badge" style={{ 
                                        background: m.match.score > 80 ? 'var(--success-light)' : 'var(--primary-light)',
                                        color: m.match.score > 80 ? 'var(--success)' : 'var(--primary)'
                                    }}>
                                        {m.match.score}%
                                    </div>
                                    <div className="match-details">
                                        <strong>{m.title}</strong>
                                        <span>{m.company} • {m.location}</span>
                                    </div>
                                    <ChevronRight size={16} className="item-arrow" />
                                </div>
                            )) : (
                                <div className="empty-feed">
                                    <AlertCircle size={32} />
                                    <p>No job matches found yet. Update your profile to improve matching.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="feed-section premium-card banner-card">
                        <div className="banner-content">
                            <div className="banner-text">
                                <span className="banner-tag">UP NEXT</span>
                                <h4>Closing Systems Architecture Gaps</h4>
                                <p>Master core concepts of Scalable Design & Database Optimization</p>
                            </div>
                            <Link to="/roadmap" className="btn-primary">
                                Continue Roadmap <Rocket size={16} />
                            </Link>
                        </div>
                    </section>
                </div>

                <aside className="side-content-feed">
                    <section className="feed-section premium-card">
                        <div className="section-header-compact">
                            <h3><Clock size={18} /> Activity Log</h3>
                        </div>
                        <div className="activity-list">
                            {notifications?.map((n, idx) => (
                                <div key={idx} className="activity-item">
                                    <div className={`activity-dot ${n.type || 'info'}`}></div>
                                    <div className="activity-content">
                                        <strong>{n.title}</strong>
                                        <p>{n.message}</p>
                                    </div>
                                </div>
                            ))}
                            {(!notifications || notifications.length === 0) && (
                                <p className="empty-activity">No recent notifications.</p>
                            )}
                        </div>
                    </section>

                    <div className="ai-cta-card premium-card">
                        <div className="cta-icon"><MessageSquare size={24} /></div>
                        <h4>Interview Simulation</h4>
                        <p>Our AI coach is ready for your technical round.</p>
                        <Link to="/interview-prep" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            Start Session
                        </Link>
                    </div>
                </aside>
            </div>

            <style>{`
                .applier-dashboard { padding-bottom: 5rem; }
                .system-status { display: flex; align-items: center; }
                .status-indicator { display: flex; align-items: center; gap: 0.5rem; background: var(--success-light); color: var(--success); padding: 0.4rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; }
                
                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 2.5rem; }
                .stats-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
                .stats-icon.primary { background: var(--primary-light); color: var(--primary); }
                .stats-icon.secondary { background: var(--secondary-light); color: var(--secondary); }
                .stats-icon.success { background: var(--success-light); color: var(--success); }
                
                .stats-card .progress-bar { height: 6px; background: var(--bg-main); border-radius: 3px; margin-top: 1rem; overflow: hidden; }
                .stats-card .progress-fill { height: 100%; background: var(--primary); border-radius: 3px; }
                .card-link { margin-top: 0.75rem; font-size: 0.8rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.25rem; }

                .dash-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2.5rem; }
                .main-content-feed { display: flex; flex-direction: column; gap: 2.5rem; }
                
                .feed-section { padding: 1.5rem; }
                .section-header-compact { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .section-header-compact h3 { display: flex; align-items: center; gap: 0.6rem; font-size: 1.1rem; }
                .btn-text { font-size: 0.85rem; font-weight: 700; color: var(--primary); }

                .match-grid { display: flex; flex-direction: column; gap: 0.75rem; }
                .match-item { display: flex; align-items: center; gap: 1.25rem; padding: 1rem; border-radius: var(--radius-md); background: var(--bg-main); transition: var(--transition); border: 1px solid transparent; cursor: pointer; }
                .match-item:hover { background: white; border-color: var(--primary); transform: translateX(5px); }
                .match-badge { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; }
                .match-details { flex: 1; }
                .match-details strong { display: block; font-size: 1rem; margin-bottom: 2px; }
                .match-details span { font-size: 0.8rem; color: var(--text-muted); }
                .item-arrow { color: var(--text-light); }

                .banner-card { background: var(--bg-dark); color: white; border: none; }
                .banner-content { display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
                .banner-tag { color: var(--primary); font-weight: 800; font-size: 0.7rem; letter-spacing: 0.1em; }
                .banner-text h4 { font-size: 1.25rem; margin: 0.5rem 0; color: white; }
                .banner-text p { opacity: 0.7; font-size: 0.95rem; }

                .side-content-feed { display: flex; flex-direction: column; gap: 2.5rem; }
                .activity-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .activity-item { display: flex; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
                .activity-item:last-child { border: none; padding-bottom: 0; }
                .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
                .activity-dot.success { background: var(--success); }
                .activity-dot.info { background: var(--primary); }
                .activity-content strong { display: block; font-size: 0.9rem; margin-bottom: 0.25rem; }
                .activity-content p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

                .ai-cta-card { padding: 1.5rem; background: var(--primary-light); border: 1px dashed var(--primary); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
                .cta-icon { width: 50px; height: 50px; background: white; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .ai-cta-card h4 { font-size: 1.1rem; }
                .ai-cta-card p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }

                @media (max-width: 1200px) {
                    .stats-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
                    .dash-layout { grid-template-columns: 1fr; }
                    .side-content-feed { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                }
                @media (max-width: 768px) {
                    .side-content-feed { grid-template-columns: 1fr; }
                    .banner-content { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default ApplierDashboard;
