import React, { useState, useEffect } from 'react';
import { applicationApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';
import { 
    Briefcase, Clock, ChevronRight, MapPin, 
    MessageSquare, Award, AlertCircle, X,
    ExternalLink, PlayCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    const userId = user?._id || user?.id;

    useEffect(() => {
        const fetchApps = async () => {
            if (!userId) return;
            try {
                const res = await applicationApi.getByUser(userId);
                setApplications(res.data);
            } catch (err) {
                console.error("Error fetching applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();

        const socket = io(SOCKET_URL);
        
        socket.on('application:update', (updatedApp) => {
            // Update local application if it's the applier's
            if (String(updatedApp.applierId?._id || updatedApp.applierId) === String(userId)) {
                setApplications(prev => prev.map(a => (a.id === updatedApp._id || a._id === updatedApp._id) ? updatedApp : a));
                
                // If the selected app is the updated one, update it too
                if (selectedApp && (selectedApp.id === updatedApp._id || selectedApp._id === updatedApp._id)) {
                    setSelectedApp(updatedApp);
                }
            }
        });

        return () => socket.disconnect();
    }, [userId, selectedApp?.id]);

    const columns = [
        { id: 'Applied', color: '#6366f1', icon: <Clock size={16} /> },
        { id: 'Review', color: '#f59e0b', icon: <AlertCircle size={16} /> },
        { id: 'Interviewing', color: '#8b5cf6', icon: <MessageSquare size={16} /> },
        { id: 'Offered', color: '#10b981', icon: <Award size={16} /> },
    ];

    if (loading) return (
        <div className="loading-screen animate-fade-in">
            <div className="pulse-loader"></div>
            <p>Loading Your Applications...</p>
        </div>
    );

    return (
        <div className="my-apps-page animate-fade-in">
            <div className="page-header-section">
                <div>
                    <h1>My Applications</h1>
                    <p>Track your job applications and status updates here.</p>
                </div>
                <div className="pipeline-stats">
                    <div className="stat-pill"><div className="dot blue"></div> {applications.length} Total</div>
                    <div className="stat-pill"><div className="dot green"></div> {applications.filter(a => a.status === 'Offered').length} Offers</div>
                </div>
            </div>


            <div className="kanban-container">
                {columns.map(col => (
                    <div key={col.id} className="kanban-column">
                        <div className="column-header" style={{ color: col.color }}>
                            <div className="title-group">
                                {col.icon}
                                <span>{col.id}</span>
                            </div>
                            <span className="badge-count">{applications.filter(a => a.status === col.id).length}</span>
                        </div>
                        
                        <div className="column-stack">
                            {applications.filter(a => a.status === col.id).map(app => (
                                <div key={app.id || app._id} className="app-pipeline-card premium-card" onClick={() => setSelectedApp(app)}>
                                    <div className="app-card-top">
                                        <h4>{app.jobId?.title || 'System Architect'}</h4>
                                        <div className="company-row">{app.jobId?.company || 'Organization'}</div>
                                    </div>
                                    
                                    {app.assignedTest?.testId && (
                                        <div className="assessment-alert">
                                            <PlayCircle size={14} />
                                            <span>Assessment Pending</span>
                                        </div>
                                    )}

                                    <div className="app-card-bottom">
                                        <div className="location-tag">
                                            <MapPin size={12} />
                                            {app.jobId?.location || 'Remote'}
                                        </div>
                                        <div className="details-nudge">
                                            View Log <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {applications.filter(a => a.status === col.id).length === 0 && (
                                <div className="empty-lane-state">No active applications</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedApp && (
                <div className="modal-backdrop glass animate-fade-in" onClick={() => setSelectedApp(null)}>
                    <div className="pipeline-modal premium-card animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-top">
                            <div className="modal-title-group">
                                <div className="app-icon-box"><Briefcase size={22} /></div>
                                <div>
                                    <h3>{selectedApp.jobId?.title}</h3>
                                    <p className="modal-subtitle">{selectedApp.jobId?.company} • Applied {new Date(selectedApp.appliedAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setSelectedApp(null)}><X size={20} /></button>
                        </div>

                        <div className="modal-scroll-area">
                            {selectedApp.assignedTest?.testId && (
                                <div className="assessment-card premium-card">
                                    <div className="ass-info">
                                        <PlayCircle size={28} className="icon-pulse" />
                                        <div>
                                            <h4>Skill Assessment Required</h4>
                                            <p>This employer has requested a technical evaluation.</p>
                                        </div>
                                    </div>
                                    <Link to={`/assessments`} className="btn-primary-sm">Start Test <ExternalLink size={14} /></Link>
                                </div>
                            )}

                            <div className="timeline-section">
                                <h4 className="section-label">Pipeline Movement History</h4>
                                <div className="modern-timeline">
                                    {(selectedApp.updates?.length > 0 ? selectedApp.updates : [
                                        { status: 'Applied', note: 'Initial application submitted successfully.', updatedAt: selectedApp.appliedAt || Date.now() }
                                    ]).map((update, i) => (
                                        <div key={i} className="timeline-checkpoint">
                                            <div className="checkpoint-marker">
                                                <div className="checkpoint-dot"></div>
                                                <div className="checkpoint-line"></div>
                                            </div>
                                            <div className="checkpoint-content">
                                                <div className="checkpoint-header">
                                                    <span className="checkpoint-status">{update.status}</span>
                                                    <span className="checkpoint-date">{new Date(update.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="checkpoint-note">{update.note}</p>
                                            </div>
                                        </div>
                                    )).reverse()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .my-apps-page { display: flex; flex-direction: column; gap: 3rem; }
                .page-header-section { display: flex; justify-content: space-between; align-items: flex-start; }
                .page-header-section h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 0.5rem; }
                .page-header-section p { color: var(--text-muted); font-weight: 600; font-size: 1.1rem; }
                
                .pipeline-stats { display: flex; gap: 1rem; }
                .stat-pill { background: white; border: 1px solid var(--border); padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 0.6rem; color: var(--text-main); }
                .dot { width: 8px; height: 8px; border-radius: 50%; }
                .dot.blue { background: #3b82f6; }
                .dot.green { background: #22c55e; }

                .kanban-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; align-items: flex-start; }
                .kanban-column { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.25rem; background: #f8fafc; border-radius: var(--radius-xl); border: 1px solid rgba(0,0,0,0.02); }
                
                .column-header { display: flex; justify-content: space-between; align-items: center; padding: 0 0.5rem; font-weight: 850; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
                .title-group { display: flex; align-items: center; gap: 0.75rem; }
                .badge-count { background: white; color: var(--text-light); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.7rem; border: 1px solid var(--border); }

                .column-stack { display: flex; flex-direction: column; gap: 1rem; min-height: 400px; }
                .app-pipeline-card { padding: 1.5rem; cursor: pointer; border: 1px solid transparent; transition: var(--transition); }
                .app-pipeline-card:hover { transform: translateY(-5px); border-color: var(--primary-light); box-shadow: var(--shadow-xl); }

                .app-card-top h4 { font-size: 1.15rem; font-weight: 850; color: var(--text-main); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .company-row { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); margin-bottom: 1.25rem; }

                .assessment-alert { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem; background: #fff7ed; color: #c2410c; border-radius: 10px; border: 1px solid #ffedd5; font-size: 0.75rem; font-weight: 800; margin-bottom: 1.25rem; }
                
                .app-card-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border); }
                .location-tag { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; font-weight: 700; color: var(--text-light); }
                .details-nudge { font-size: 0.75rem; font-weight: 850; color: var(--primary); display: flex; align-items: center; gap: 0.2rem; }

                .empty-lane-state { text-align: center; padding: 2rem; color: var(--text-light); font-size: 0.8rem; font-weight: 700; opacity: 0.5; border: 2px dashed var(--border); border-radius: var(--radius-lg); }

                .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .pipeline-modal { width: 100%; max-width: 650px; max-height: 90vh; background: white; padding: 3rem; display: flex; flex-direction: column; position: relative; z-index: 1001; }
                
                .modal-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
                .modal-title-group { display: flex; gap: 1.5rem; align-items: center; }
                .app-icon-box { background: var(--primary-light); color: var(--primary); padding: 1rem; border-radius: var(--radius-lg); }
                .modal-title-group h3 { font-size: 1.75rem; font-weight: 950; letter-spacing: -1px; }
                .modal-subtitle { font-size: 1rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem; }
                .modal-close { background: #f1f5f9; padding: 0.5rem; border-radius: 50%; color: var(--text-light); transition: var(--transition); }
                .modal-close:hover { background: #e2e8f0; color: var(--text-main); }

                .modal-scroll-area { overflow-y: auto; flex: 1; padding-right: 1.5rem; }
                .assessment-card { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: #eef2ff; border: 1px solid #c7d2fe; margin-bottom: 2.5rem; }
                .ass-info { display: flex; gap: 1.25rem; align-items: center; }
                .ass-info h4 { font-weight: 900; color: #1e1b4b; margin-bottom: 0.2rem; }
                .ass-info p { font-size: 0.85rem; font-weight: 600; color: #4338ca; }
                .btn-primary-sm { background: var(--primary); color: white; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3); }

                .section-label { font-size: 0.8rem; font-weight: 850; text-transform: uppercase; color: var(--text-light); letter-spacing: 1px; margin-bottom: 2rem; display: block; }
                .modern-timeline { padding-left: 2rem; border-left: 2px solid #f1f5f9; position: relative; }
                .timeline-checkpoint { position: relative; margin-bottom: 3rem; }
                .checkpoint-marker { position: absolute; left: -33px; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; }
                .checkpoint-dot { width: 12px; height: 12px; background: var(--primary); border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 4px var(--primary-light); z-index: 5; }
                .checkpoint-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
                .checkpoint-status { font-weight: 900; color: var(--text-main); font-size: 1.1rem; }
                .checkpoint-date { font-size: 0.8rem; font-weight: 700; color: var(--text-light); }
                .checkpoint-note { font-size: 1rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; }

                @media (max-width: 1100px) { .kanban-container { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 700px) { .kanban-container { grid-template-columns: 1fr; } .pipeline-modal { padding: 2rem; } }
            `}</style>
        </div>
    );
};
