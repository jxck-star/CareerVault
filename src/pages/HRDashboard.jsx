import React, { useState, useEffect } from 'react';
import { jobApi, profileApi, applicationApi, notificationApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { calculateMatchScore } from '../utils/matchingEngine';
import { io } from 'socket.io-client';
import { Users, Briefcase, ChevronRight, Star, ArrowUpRight, Filter, Plus, Trash2, Mail, Phone, MapPin, GraduationCap, X, ShieldCheck, Rocket, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const HRDashboard = () => {
    const { user } = useAuth();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingProfile, setViewingProfile] = useState(null);

    const loadData = async () => {
        const userId = user?._id || user?.id;
        if (!userId) return;
        try {
            const [jobsRes, profilesRes, appsRes] = await Promise.all([
                jobApi.getAll(),
                profileApi.getAllAppliers ? profileApi.getAllAppliers() : profileApi.get('all'), 
                applicationApi.getAll ? applicationApi.getAll() : applicationApi.getByUser(userId) 
            ]);
            
            const myJobs = jobsRes.data.filter(j => {
                const jobHrId = String(j.hrId?._id || j.hrId || '');
                const jobPostedBy = String(j.postedBy || '');
                return jobHrId === String(userId) || jobPostedBy === String(userId);
            });
            setJobs(myJobs);
            setCandidates(profilesRes.data || []);
            setApplications(appsRes.data || []);
            
            if (myJobs.length > 0 && !selectedJobId) {
                setSelectedJobId(myJobs[0].id);
            }
        } catch (err) {
            console.error("Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const socket = io(SOCKET_URL);
        
        socket.on('application:new', (newApp) => {
            console.log('Notification: New application received');
            setApplications(prev => [newApp, ...prev]);
        });


        socket.on('application:update', (updatedApp) => {
            setApplications(prev => prev.map(a => a._id === updatedApp._id ? updatedApp : a));
        });

        return () => socket.disconnect();
    }, [user?._id, user?.id]);


    const selectedJob = jobs?.find(j => j.id === selectedJobId) || null;

    const rankedCandidates = (selectedJob && candidates && candidates.length > 0)
        ? candidates.map(c => {
            const candidateId = c.id || c._id;
            return {
                ...c,
                match: calculateMatchScore(c, selectedJob),
                appStatus: applications?.find(a => {
                    const appId = (a.jobId?._id || a.jobId?.id || a.jobId)?.toString();
                    const targetJobId = selectedJob.id?.toString();
                    const applierId = (a.applierId?._id || a.applierId?.id || a.applierId)?.toString();
                    return appId === targetJobId && applierId === candidateId?.toString();
                })?.status || null
            };
        }).sort((a, b) => b.match.score - a.match.score)
        : [];

    const getApplicantCount = (jobId) => {
        return applications?.filter(a => (a.jobId?._id || a.jobId?.id || a.jobId) === jobId).length || 0;
    };

    const deleteJob = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await jobApi.delete(jobId);
            loadData();
            if (selectedJobId === jobId) setSelectedJobId(null);
        } catch (err) {
            console.error("Delete job error:", err);
        }
    };

    if (loading) return (
        <div className="dashboard-loading">
            <div className="pulse-loader"></div>
            <p>Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="hr-dashboard animate-fade-in">
            <header className="page-header">
                <div className="header-context">
                    <span className="context-label">HR Management Portal</span>
                    <h1>Recruitment Dashboard</h1>
                    <p>Managing the hiring process for <span className="text-primary">{user.company || 'your company'}</span>.</p>
                </div>
                <Link to="/post-job" className="btn-primary btn-lg-premium">
                    <Plus size={18} /> Post New Job
                </Link>
            </header>


            <div className="hr-layout">
                <aside className="job-sidebar premium-card">
                    <div className="sidebar-section-title">ACTIVE ORGANIZATIONAL NODES ({jobs.length})</div>
                    <div className="job-list-premium">
                        {jobs.map(j => (
                            <div 
                                key={j.id} 
                                className={`job-item-premium ${selectedJob?.id === j.id ? 'active' : ''}`} 
                                onClick={() => setSelectedJobId(j.id)}
                            >
                                <div className="job-item-header">
                                    <span className="title">{j.title}</span>
                                    <button 
                                        className="job-delete-btn"
                                        onClick={(e) => { e.stopPropagation(); deleteJob(j.id); }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="job-item-footer">
                                    <span className="applicant-pill">
                                        <Users size={12} /> {getApplicantCount(j.id)} Candidates
                                    </span>
                                    <div className="status-dot-active"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {jobs.length === 0 && (
                        <div className="empty-sidebar-state">
                            <Briefcase size={24} />
                            <p>No active recruitment nodes.</p>
                        </div>
                    )}
                </aside>

                <section className="candidate-pool">
                    {selectedJob ? (
                        <>
                            <div className="pool-header-premium">
                                <div>
                                    <h2>Candidate Pipeline</h2>
                                    <p className="pool-subtitle">Smart matches ranked for <strong>{selectedJob.title}</strong></p>
                                </div>
                                <div className="pool-filters">
                                    <button className="filter-btn-premium"><Filter size={16} /> Filter Results</button>
                                </div>
                            </div>


                            <div className="candidate-grid-premium">
                                {rankedCandidates.map((can, idx) => (
                                    <div key={idx} className="candidate-card-premium animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        <div className="card-top-premium">
                                            <div className="score-container">
                                                <div className="score-badge-premium" style={{ 
                                                    background: can.match.score > 80 ? 'var(--success-light)' : 'var(--primary-light)',
                                                    color: can.match.score > 80 ? 'var(--success)' : 'var(--primary)'
                                                }}>
                                                    {can.match.score}%
                                                </div>
                                                <span className="score-label">MATCH</span>
                                            </div>
                                            <div className="can-main-info-premium">
                                                <h4>{can.name || 'Candidate Node'}</h4>
                                                <div className="can-loc-premium"><MapPin size={12} /> {can.personal?.location || 'Digital Nomad'}</div>
                                            </div>
                                        </div>

                                        <div className="can-skills-preview-premium">
                                            {can.match.matched.slice(0, 3).map(s => <span key={s} className="skill-tag-premium">{s}</span>)}
                                            {can.match.matched.length > 3 && <span className="skill-more-premium">+{can.match.matched.length - 3}</span>}
                                        </div>

                                        <div className="pipeline-control-premium">
                                            <span className="control-label-premium">APPLICATION STATUS</span>
                                            <select
                                                className="premium-select-dashboard"
                                                value={can.appStatus || 'Applied'}
                                                onChange={async (e) => {
                                                    const val = e.target.value;
                                                    const app = applications.find(a => 
                                                        (String(a.jobId?._id || a.jobId?.id || a.jobId) === String(selectedJob.id)) && 
                                                        (String(a.applierId?._id || a.applierId?.id || a.applierId) === String(can.id || can._id))
                                                    );
                                                    if (!app) return;
                                                    const appId = app.id || app._id;
                                                    setApplications(prev => prev.map(a => (a.id === appId || a._id === appId) ? { ...a, status: val } : a));

                                                    try {
                                                        await applicationApi.updateStatus(appId, val);
                                                        await notificationApi.create({
                                                            userId: (can.id || can._id),
                                                            title: 'Application Update',
                                                            message: `Your application for ${selectedJob.title} has been moved to: ${val}`,
                                                            type: 'info'
                                                        });
                                                    } catch (err) {
                                                        console.error("Status update error:", err);
                                                        setApplications(prev => prev.map(a => (a.id === appId || a._id === appId) ? { ...a, status: app.status } : a));
                                                    }
                                                }}
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="Review">In Review</option>
                                                <option value="Interviewing">Interviewing</option>
                                                <option value="Offered">Offered</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>


                                        <div className="card-actions-premium">
                                            <button 
                                                className={`action-btn-premium shortlist-btn-premium ${applications.find(a => 
                                                    String(a.jobId?._id || a.jobId?.id || a.jobId) === String(selectedJob.id) && 
                                                    String(a.applierId?._id || a.applierId?.id || a.applierId) === String(can.id || can._id)
                                                )?.shortlisted ? 'active' : ''}`}
                                                onClick={async () => {
                                                    const candidateId = String(can.id || can._id);
                                                    const app = applications.find(a => 
                                                        String(a.jobId?._id || a.jobId?.id || a.jobId) === String(selectedJob.id) && 
                                                        String(a.applierId?._id || a.applierId?.id || a.applierId) === candidateId
                                                    );
                                                    if (!app) return;
                                                    const appId = app.id || app._id;
                                                    const newState = !app.shortlisted;
                                                    setApplications(prev => prev.map(a => (a.id === appId || a._id === appId) ? { ...a, shortlisted: newState } : a));
                                                    try { await applicationApi.shortlist(appId, newState); } catch (err) { 
                                                        setApplications(prev => prev.map(a => (a.id === appId || a._id === appId) ? { ...a, shortlisted: app.shortlisted } : a));
                                                    }
                                                }}
                                            >
                                                {applications.find(a => String(a.jobId?._id || a.jobId?.id || a.jobId) === String(selectedJob.id) && String(a.applierId?._id || a.applierId?.id || a.applierId) === String(can.id || can._id))?.shortlisted ? 'Shortlisted' : 'Shortlist'}
                                            </button>
                                            <button className="action-btn-premium profile-btn-premium" onClick={() => setViewingProfile(can)}>
                                                View Profile
                                            </button>
                                        </div>

                                    </div>
                                ))}
                                {rankedCandidates.length === 0 && (
                                    <div className="empty-pool-state-premium">
                                        <Users size={48} className="empty-icon-pool" />
                                        <p>No active talent trajectories mapped to this node.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="select-job-state-premium premium-card glass">
                            <div className="state-content-premium">
                                <Rocket size={64} className="state-icon-premium" />
                                <h3>Select a Job</h3>
                                <p>Choose a position on the left to see applicants and manage the pipeline.</p>
                                <Link to="/post-job" className="btn-primary-premium btn-lg-premium" style={{ marginTop: '2rem' }}>
                                    <Plus size={18} /> Post a Job
                                </Link>
                            </div>
                        </div>

                    )}
                </section>
            </div>

            {viewingProfile && (
                <ProfileModal 
                    profile={viewingProfile} 
                    onClose={() => setViewingProfile(null)} 
                />
            )}

            <style>{`
                .hr-dashboard { padding-bottom: 5rem; }
                .header-context { display: flex; flex-direction: column; gap: 0.25rem; }
                .context-label { font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
                
                .hr-layout { display: grid; grid-template-columns: 340px 1fr; gap: 3rem; align-items: flex-start; }
                
                .job-sidebar { padding: 2rem; background: white; border: 1px solid var(--border); }
                .sidebar-section-title { font-size: 0.7rem; font-weight: 900; color: var(--text-light); letter-spacing: 0.1em; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                
                .job-list-premium { display: flex; flex-direction: column; gap: 1rem; }
                .job-item-premium { padding: 1.5rem; border-radius: var(--radius-lg); cursor: pointer; border: 1px solid transparent; transition: var(--transition); background: var(--bg-main); }
                .job-item-premium:hover { border-color: var(--border-hover); background: white; transform: translateX(5px); }
                .job-item-premium.active { background: white; border-color: var(--primary); box-shadow: var(--shadow-md); }
                .job-item-premium.active .title { color: var(--primary); font-weight: 800; }
                
                .job-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
                .job-item-premium .title { font-weight: 700; font-size: 1rem; color: var(--text-main); }
                .job-delete-btn { color: var(--text-light); padding: 0.4rem; border-radius: var(--radius-sm); }
                .job-delete-btn:hover { color: var(--danger); background: var(--danger-light); }
                
                .job-item-footer { display: flex; justify-content: space-between; align-items: center; }
                .status-dot-active { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
                
                .pool-header-premium { margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end; }
                .pool-header-premium h2 { font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 0.5rem; }
                .pool-subtitle { color: var(--text-muted); font-size: 1.1rem; }
                .pool-subtitle strong { color: var(--primary); }
                
                .filter-btn-premium { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; background: white; border: 1px solid var(--border); border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
                .filter-btn-premium:hover { border-color: var(--primary); color: var(--primary); }

                .candidate-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 2rem; }
                .candidate-card-premium { padding: 2rem; background: white; border: 1px solid var(--border); border-radius: var(--radius-xl); transition: var(--transition); border-bottom: 4px solid var(--border); }
                .candidate-card-premium:hover { border-color: var(--primary); transform: translateY(-5px); box-shadow: var(--shadow-premium); }
                
                .card-top-premium { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem; }
                .score-container { text-align: center; }
                .score-badge-premium { width: 60px; height: 60px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.25rem; margin-bottom: 0.25rem; }
                .score-label { font-size: 0.6rem; font-weight: 800; color: var(--text-light); text-transform: uppercase; }
                
                .can-main-info-premium h4 { font-size: 1.25rem; margin-bottom: 0.25rem; color: var(--bg-dark); }
                .can-loc-premium { font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; font-weight: 700; }
                
                .can-skills-preview-premium { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; min-height: 28px; }
                .skill-tag-premium { font-size: 0.7rem; font-weight: 800; color: var(--primary); background: var(--primary-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(79, 70, 229, 0.1); }
                .skill-more-premium { font-size: 0.75rem; font-weight: 700; color: var(--text-light); }
                
                .pipeline-control-premium { background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 2rem; border-left: 4px solid var(--primary); }
                .control-label-premium { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); display: block; margin-bottom: 0.75rem; letter-spacing: 0.1em; }
                .premium-select-dashboard { width: 100%; padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border); background: white; font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
                .premium-select-dashboard:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px var(--primary-light); }

                .card-actions-premium { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .action-btn-premium { padding: 1rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.85rem; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; transition: var(--transition); }
                .shortlist-btn-premium { border: 2px solid var(--primary); color: var(--primary); }
                .shortlist-btn-premium:hover { background: var(--primary-light); }
                .shortlist-btn-premium.active { background: var(--success); border-color: var(--success); color: white; }
                .profile-btn-premium { background: var(--bg-dark); color: white; border: 2px solid var(--bg-dark); }
                .profile-btn-premium:hover { background: #1e293b; border-color: #1e293b; }

                .select-job-state-premium { height: 500px; display: flex; align-items: center; justify-content: center; text-align: center; border-style: dashed; border-width: 2px; border-color: var(--border-hover); border-radius: var(--radius-2xl); }
                .state-content-premium { max-width: 400px; display: flex; flex-direction: column; align-items: center; }
                .state-icon-premium { color: var(--primary); opacity: 0.1; margin-bottom: 2rem; }
                .select-job-state-premium h3 { font-size: 1.75rem; margin-bottom: 1rem; letter-spacing: -1px; }
                .select-job-state-premium p { font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; }
                
                .empty-pool-state-premium { grid-column: 1 / -1; padding: 6rem; text-align: center; opacity: 0.5; }
                .empty-icon-pool { margin-bottom: 1.5rem; color: var(--text-light); }

                @media (max-width: 1024px) {
                    .hr-layout { grid-template-columns: 1fr; }
                    .job-sidebar { display: none; }
                }
            `}</style>
        </div>
    );
};

const ProfileModal = ({ profile, onClose }) => {
    const candidate = profile; 

    return (
        <div className="modal-overlay glass animate-fade-in" onClick={onClose}>
            <div className="profile-modal premium-modal animate-scale-up" onClick={e => e.stopPropagation()}>
                <button className="close-profile-btn" onClick={onClose} aria-label="Close Profile">
                    <X size={20} />
                </button>

                <div className="modal-layout">
                    <aside className="profile-sidebar-premium">
                        <div className="profile-avatar-container">
                            <div className="profile-badge-status online"></div>
                            <div className="large-avatar-premium">
                                {candidate.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                        
                        <div className="profile-header-info">
                            <h2 className="premium-name">
                                {candidate.name}
                                <ShieldCheck size={18} className="verified-icon" title="Identity Verified" />
                            </h2>
                            <p className="premium-role">{candidate.personal?.bio?.slice(0, 60) || 'Professional Node'}...</p>
                        </div>

                        <div className="sidebar-details-premium">
                            <div className="detail-item-premium">
                                <Mail size={16} />
                                <span>{candidate.email}</span>
                            </div>
                            <div className="detail-item-premium">
                                <Target size={16} />
                                <span>{candidate.experience?.length || 0} Professional Roles</span>
                            </div>
                        </div>

                        <div className="profile-completeness-premium">
                            <div className="completeness-header">
                                <span>Verification Score</span>
                                <span className="score-val">94%</span>
                            </div>
                            <div className="completeness-bar">
                                <div className="completeness-fill" style={{ width: '94%' }}></div>
                            </div>
                        </div>
                    </aside>

                    <main className="profile-content-premium">
                        <div className="content-inner-premium">
                            <section className="profile-section-premium animate-slide-up">
                                <div className="section-title-premium">Professional Overview</div>
                                <p className="summary-text-premium">
                                    {candidate.personal?.bio || "A dedicated professional with a comprehensive technical background and a passion for building scalable solutions."}
                                </p>
                            </section>

                            <section className="profile-section-premium animate-slide-up delay-1">
                                <div className="section-title-premium mb-4">Career Trajectory</div>
                                <div className="timeline-premium">
                                    {candidate.experience?.length > 0 ? (
                                        candidate.experience.map((exp, idx) => (
                                            <div key={idx} className="timeline-item-premium">
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-content-premium">
                                                    <div className="exp-header">
                                                        <h4 className="exp-job-premium">{exp.position}</h4>
                                                        <span className="exp-date-premium">{exp.startDate} - {exp.endDate}</span>
                                                    </div>
                                                    <h5 className="exp-company-premium">{exp.company}</h5>
                                                    <p className="exp-desc-premium">{exp.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="empty-state-premium">Initial career trajectory pending.</p>
                                    )}
                                </div>
                            </section>

                            <section className="profile-section-premium animate-slide-up delay-2">
                                <div className="section-title-premium mb-4">Academic Background</div>
                                <div className="education-grid-premium">
                                    {candidate.education?.map((edu, idx) => (
                                        <div key={idx} className="edu-card-premium">
                                            <div className="edu-icon-premium"><GraduationCap size={18} /></div>
                                            <div>
                                                <div className="edu-degree-premium">{edu.degree}</div>
                                                <div className="edu-school-premium">{edu.school}</div>
                                                <div className="edu-year-premium">{edu.year}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="profile-section-premium animate-slide-up delay-3">
                                <div className="section-title-premium mb-4">Technical Stack</div>
                                <div className="skills-cloud-premium">
                                    {candidate.skills?.map((skill, idx) => (
                                        <span key={idx} className="skill-chip-premium" style={{ animationDelay: `${idx * 0.1}s` }}>
                                            {skill.name} <small>{skill.level}</small>
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>

                <style>{`
                    .premium-modal {
                        width: 1000px;
                        max-width: 95vw;
                        height: 850px;
                        max-height: 90vh;
                        background: #ffffff;
                        border-radius: 2.5rem;
                        overflow: hidden;
                        position: relative;
                        box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25);
                        border: 1px solid rgba(255, 255, 255, 0.4);
                    }

                    .close-profile-btn {
                        position: absolute;
                        top: 2rem;
                        right: 2rem;
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        background: #f1f5f9;
                        color: #64748b;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 100;
                        transition: all 0.2s;
                    }

                    .close-profile-btn:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }

                    .modal-layout { display: flex; height: 100%; }

                    .profile-sidebar-premium {
                        width: 320px;
                        background: #f8fafc;
                        border-right: 1px solid rgba(0,0,0,0.05);
                        padding: 4.5rem 2.5rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .large-avatar-premium {
                        width: 120px;
                        height: 120px;
                        background: #4f46e5;
                        background: linear-gradient(135deg, #4f46e5, #818cf8);
                        border-radius: 2.5rem;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 3.5rem; font-weight: 900; color: white;
                        box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.4);
                        margin-bottom: 2rem;
                    }

                    .premium-name { font-size: 1.5rem; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem; }
                    .verified-icon { color: #10b981; }
                    .premium-role { color: #64748b; font-weight: 600; font-size: 0.85rem; margin-bottom: 2.5rem; }

                    .sidebar-details-premium { width: 100%; margin: 2rem 0; display: flex; flex-direction: column; gap: 1rem; }
                    .detail-item-premium { display: flex; align-items: center; gap: 1rem; color: #64748b; font-size: 0.85rem; font-weight: 600; padding: 0.75rem; background: rgba(255,255,255,0.5); border-radius: 1rem; }

                    .profile-completeness-premium { width: 100%; margin-top: auto; text-align: left; }
                    .completeness-header { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 0.5rem; }
                    .score-val { color: var(--primary); }
                    .completeness-bar { height: 8px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
                    .completeness-fill { height: 100%; background: var(--primary); border-radius: 10px; }

                    .profile-content-premium { flex: 1; padding: 4.5rem; overflow-y: auto; background: #ffffff; }
                    .content-inner-premium { max-width: 800px; }

                    .section-title-premium { font-size: 1rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2rem; position: relative; opacity: 0.6; }

                    .summary-text-premium { font-size: 1.1rem; line-height: 1.8; color: #475569; margin-bottom: 3.5rem; }

                    .timeline-premium { position: relative; padding-left: 2rem; border-left: 2px solid #f1f5f9; }
                    .timeline-item-premium { position: relative; margin-bottom: 3rem; }
                    .timeline-dot { position: absolute; left: -37px; top: 0; width: 12px; height: 12px; background: var(--primary); border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 4px #e0e7ff; z-index: 2; }
                    
                    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
                    .exp-job-premium { font-size: 1.25rem; font-weight: 800; color: #1e293b; }
                    .exp-date-premium { font-size: 0.8rem; font-weight: 700; color: var(--primary); background: #f5f3ff; padding: 0.25rem 0.75rem; border-radius: 1rem; }
                    .exp-company-premium { font-size: 1rem; font-weight: 700; color: #4f46e5; margin-bottom: 1rem; }
                    .exp-desc-premium { line-height: 1.6; color: #64748b; font-size: 0.95rem; }

                    .education-grid-premium { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
                    .edu-card-premium { padding: 1.5rem; background: #f8fafc; border-radius: 1.5rem; border: 1px solid rgba(0,0,0,0.03); display: flex; gap: 1.5rem; }
                    .edu-icon-premium { width: 42px; height: 42px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); box-shadow: 0 8px 16px rgba(0,0,0,0.05); }
                    .edu-degree-premium { font-weight: 800; color: #1e293b; margin-bottom: 0.25rem; }
                    .edu-school-premium { font-size: 0.9rem; color: #64748b; margin-bottom: 0.25rem; }
                    .edu-year-premium { font-size: 0.85rem; font-weight: 700; color: var(--primary); }

                    .skills-cloud-premium { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                    .skill-chip-premium { padding: 0.6rem 1.2rem; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 1rem; font-size: 0.85rem; font-weight: 700; color: #475569; transition: all 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                    .skill-chip-premium small { margin-left: 0.5rem; color: var(--primary); font-weight: 500; font-size: 0.7rem; }
                `}</style>
            </div>
        </div>
    );
};
