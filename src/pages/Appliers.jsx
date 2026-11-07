import React, { useState, useEffect } from 'react';
import { applicationApi, jobApi, assessmentApi, notificationApi, profileApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';
import { 
    Users, Search, Filter, MoreHorizontal, 
    CheckCircle2, Clock,AlertCircle, Send, 
    FileText, CheckSquare, ChevronRight, X,
    MessageSquare, Award
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const Appliers = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateNote, setUpdateNote] = useState('');
    const [newStatus, setNewStatus] = useState('');

    const loadData = async () => {
        try {
            const [appsRes, jobsRes, testRes] = await Promise.all([
                applicationApi.getAll(),
                jobApi.getAll(),
                assessmentApi.getAll()
            ]);

            const currentUserId = String(user.id || user._id);
            
            // Log for debugging
            console.log("[DEBUG] Current HR User ID:", currentUserId);
            console.log("[DEBUG] Total Jobs found:", jobsRes.data.length);

            // Filter jobs posted by this HR
            const myJobs = jobsRes.data.filter(j => {
                const jobHrId = String(j.hrId?._id || j.hrId || j.postedBy);
                return jobHrId === currentUserId;
            });
            
            const myJobIds = myJobs.map(j => String(j.id || j._id));
            console.log("[DEBUG] HR Job IDs:", myJobIds);

            // Filter applications for these jobs
            const filteredApps = appsRes.data.filter(a => {
                const jobRefId = String(a.jobId?._id || a.jobId?.id || a.jobId);
                return myJobIds.includes(jobRefId);
            });

            console.log("[DEBUG] Filtered Applications count:", filteredApps.length);

            setApplications(filteredApps);
            setJobs(myJobs);
            setAssessments(testRes.data || []);
        } catch (err) {
            console.error("Load data error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const socket = io(SOCKET_URL);

        socket.on('application:new', (newApp) => {
            const currentUserId = String(user.id || user._id);
            // Check if this app belongs to one of this HR's jobs
            // Need to handle both populated and unpopulated jobId
            const appIdFromJob = String(newApp.jobId?._id || newApp.jobId?.id || newApp.jobId);
            
            // Refetch or locally check? Refetch is safer but local is faster.
            // Let's check local jobs list
            if (jobs.some(j => String(j.id || j._id) === appIdFromJob)) {
                setApplications(prev => [newApp, ...prev]);
            }
        });

        socket.on('application:update', (updatedApp) => {
            setApplications(prev => prev.map(a => (String(a.id || a._id) === String(updatedApp._id || updatedApp.id)) ? updatedApp : a));
        });

        return () => socket.disconnect();
    }, [user.id, user._id, jobs.length]);

    const handleUpdateStatus = async (appId, status, note) => {
        try {
            const res = await applicationApi.updateStatus(appId, status, note);
            const updatedApp = res.data;
            setApplications(prev => prev.map(a => (String(a.id || a._id) === String(appId)) ? updatedApp : a));
            
            // Notify Applier (applierId is now populated as an object in the response)
            const targetUserId = updatedApp.applierId?._id || updatedApp.applierId?.id || updatedApp.applierId;
            
            await notificationApi.create({
                userId: targetUserId,
                title: 'Application Update',
                message: `Status updated for ${updatedApp.jobId?.title || 'Job'}: ${status}. Note: ${note}`,
                type: 'info'
            });
            
            setShowUpdateModal(false);
            setUpdateNote('');
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update status");
        }
    };

    const handleAssignTest = async (appId, testId) => {
        try {
            const res = await applicationApi.assignTest(appId, testId);
            const updatedApp = res.data;
            setApplications(prev => prev.map(a => (String(a.id || a._id) === String(appId)) ? updatedApp : a));
            
            const test = assessments.find(t => String(t.id || t._id) === String(testId));
            const targetUserId = updatedApp.applierId?._id || updatedApp.applierId?.id || updatedApp.applierId;

            await notificationApi.create({
                userId: targetUserId,
                title: 'Assessment Assigned',
                message: `HR has assigned you a test: ${test.title} for ${updatedApp.jobId?.title || 'Job'}`,
                type: 'warning'
            });
            alert("Test assigned successfully!");
        } catch (err) {
            console.error("Assign test error:", err);
            alert("Failed to assign test");
        }
    };

    const filteredList = applications.filter(app => {
        const candidateName = app.applierId?.name || 'External Candidate';
        const jobTitle = app.jobId?.title || 'General Pool';
        
        const matchesSearch = candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });


    if (loading) return (
        <div className="loading-container">
            <div className="pulse-loader"></div>
            <p>Loading Pipeline Data...</p>
        </div>
    );

    return (
        <div className="appliers-page animate-fade-in">
            <header className="page-header-minimal">
                <div>
                    <h1>Applicant Tracking</h1>
                    <p>Manage your candidates and hiring pipeline easily.</p>
                </div>
                <div className="header-search premium-card">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, role, or skills..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>


            <div className="stats-dashboard">
                <div className="insight-card premium-card">
                    <div className="insight-icon pink"><Users size={24} /></div>
                    <div className="insight-data">
                        <h3>{applications.length}</h3>
                        <p>Total Applicants</p>
                    </div>
                </div>
                <div className="insight-card premium-card">
                    <div className="insight-icon blue"><Clock size={24} /></div>
                    <div className="insight-data">
                        <h3>{applications.filter(a => a.status === 'Applied').length}</h3>
                        <p>New Apps</p>
                    </div>
                </div>
                <div className="insight-card premium-card">
                    <div className="insight-icon yellow"><AlertCircle size={24} /></div>
                    <div className="insight-data">
                        <h3>{applications.filter(a => a.status === 'Review').length}</h3>
                        <p>Under Review</p>
                    </div>
                </div>
                <div className="insight-card premium-card">
                    <div className="insight-icon green"><CheckCircle2 size={24} /></div>
                    <div className="insight-data">
                        <h3>{applications.filter(a => a.status === 'Offered').length}</h3>
                        <p>Selected</p>
                    </div>
                </div>
            </div>


            <main className="pipeline-container">
                <div className="pipeline-filter premium-card">
                    {['All', 'Applied', 'Review', 'Interviewing', 'Offered', 'Rejected'].map(status => (
                        <button 
                            key={status}
                            className={statusFilter === status ? 'active' : ''} 
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'All' ? 'All Candidates' : status}
                            {statusFilter === status && <div className="active-dot"></div>}
                        </button>
                    ))}
                </div>

                <div className="registry-table-wrapper premium-card">
                    <table className="registry-table">
                        <thead>
                            <tr>
                                <th>Candidate Details</th>
                                <th>Applied Job</th>
                                <th>Status</th>
                                <th>Assessments</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map((app) => (
                                <tr key={app.id}>
                                    <td>
                                        <div className="candidate-meta">
                                            <div className="cand-avatar-pro">{app.applierId?.name?.[0]}</div>
                                            <div>
                                                <div className="cand-name-pro">{app.applierId?.name || 'External Candidate'}</div>
                                                <div className="cand-email-pro">{app.applierId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="role-chip-pro">{app.jobId?.title || 'General Pool'}</div>
                                    </td>
                                    <td>
                                        <span className={`phase-pill ${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        {app.assignedTest?.testId ? (
                                            <div className="matrix-status">
                                                <span className={`matrix-badge ${app.assignedTest.status.toLowerCase()}`}>
                                                    {app.assignedTest.status}
                                                </span>
                                                {app.assignedTest.score && <div className="matrix-score">{app.assignedTest.score}% Match</div>}
                                            </div>
                                        ) : (
                                            <select 
                                                className="test-selector-pro"
                                                onChange={(e) => handleAssignTest(app.id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Deploy Assessment</option>
                                                {assessments.map(t => (
                                                    <option key={t.id} value={t.id}>{t.title}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        <div className="pulse-info">
                                            {app.updates?.length > 0 ? (
                                                <>
                                                    <div className="pulse-note">{app.updates[app.updates.length-1].note}</div>
                                                    <small>{new Date(app.updates[app.updates.length-1].updatedAt).toLocaleDateString()}</small>
                                                </>
                                            ) : (
                                                <small>Inception: {new Date(app.appliedAt).toLocaleDateString()}</small>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-op-update"
                                            onClick={() => {
                                                setSelectedApp(app);
                                                setNewStatus(app.status);
                                                setShowUpdateModal(true);
                                            }}
                                        >
                                            <MessageSquare size={14} /> Update Status
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredList.length === 0 && (
                        <div className="empty-registry">
                            <Users size={48} />
                            <p>No candidates manifest in this pipeline segment.</p>
                        </div>
                    )}
                </div>
            </main>

            {showUpdateModal && selectedApp && (
                <div className="modal-backdrop-blur" onClick={() => setShowUpdateModal(false)}>
                    <div className="phase-update-modal premium-card animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-pro">
                            <h3><Award size={20} /> Update Application Status</h3>
                            <button className="btn-close-modal" onClick={() => setShowUpdateModal(false)}><X /></button>
                        </div>
                        <div className="modal-body-pro">
                            <div className="input-group-pro">
                                <label>New Status</label>
                                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                    <option value="Applied">Applied</option>
                                    <option value="Review">Shortlisted / Review</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Offered">Offered</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="input-group-pro">
                                <label>Feedback Note (Visible to Applier)</label>
                                <textarea 
                                    placeholder="Add a note about the candidate's progress..."
                                    value={updateNote}
                                    onChange={(e) => setUpdateNote(e.target.value)}
                                    rows="5"
                                ></textarea>
                            </div>
                            <button 
                                className="btn-save-phase"
                                onClick={() => handleUpdateStatus(selectedApp.id, newStatus, updateNote)}
                                disabled={!updateNote}
                            >
                                Update Status <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <style>{`
                .appliers-page { display: flex; flex-direction: column; gap: 3rem; }
                .page-header-minimal { display: flex; justify-content: space-between; align-items: center; }
                .page-header-minimal h1 { font-size: 2.5rem; font-weight: 950; letter-spacing: -1.5px; }
                .page-header-minimal p { color: var(--text-muted); font-weight: 600; font-size: 1.1rem; }

                .header-search { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.5rem; width: 400px; }
                .header-search input { border: none; background: transparent; width: 100%; font-weight: 600; outline: none; }

                .stats-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
                .insight-card { padding: 2rem; display: flex; align-items: center; gap: 1.5rem; border: 1px solid var(--border); }
                .insight-icon { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: white; }
                .insight-icon.pink { background: linear-gradient(135deg, #f472b6, #ec4899); box-shadow: 0 10px 20px -5px rgba(236, 72, 153, 0.3); }
                .insight-icon.blue { background: linear-gradient(135deg, #60a5fa, #3b82f6); box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.3); }
                .insight-icon.yellow { background: linear-gradient(135deg, #fbbf24, #f59e0b); box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.3); }
                .insight-icon.green { background: linear-gradient(135deg, #34d399, #10b981); box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.3); }
                .insight-data h3 { font-size: 2.25rem; font-weight: 950; line-height: 1; margin-bottom: 0.25rem; letter-spacing: -1px; }
                .insight-data p { font-size: 0.75rem; font-weight: 850; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; }

                .pipeline-container { display: flex; flex-direction: column; gap: 2rem; }
                .pipeline-filter { display: flex; gap: 0.5rem; padding: 0.6rem; width: fit-content; }
                .pipeline-filter button { padding: 0.8rem 1.5rem; border-radius: 12px; border: none; background: transparent; font-weight: 850; color: var(--text-light); transition: var(--transition); position: relative; }
                .pipeline-filter button.active { color: var(--primary); background: var(--primary-light); }
                .active-dot { width: 4px; height: 4px; background: var(--primary); border-radius: 50%; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); }

                .registry-table-wrapper { overflow: hidden; border: 1px solid var(--border); }
                .registry-table { width: 100%; border-collapse: collapse; }
                .registry-table th { text-align: left; padding: 1.5rem; background: #f8fafc; font-size: 0.7rem; font-weight: 850; text-transform: uppercase; color: var(--text-light); letter-spacing: 1.5px; border-bottom: 2px solid var(--border); }
                .registry-table td { padding: 1.5rem; border-bottom: 1px solid var(--border); transition: var(--transition); }
                .registry-table tr:hover td { background: #f9fafb; }

                .candidate-meta { display: flex; align-items: center; gap: 1.25rem; }
                .cand-avatar-pro { width: 45px; height: 45px; background: var(--primary-light); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 1.1rem; }
                .cand-name-pro { font-weight: 850; color: var(--text-main); font-size: 1.05rem; }
                .cand-email-pro { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

                .role-chip-pro { padding: 0.5rem 1rem; background: #f1f5f9; border-radius: 10px; font-weight: 800; font-size: 0.8rem; color: var(--text-main); border: 1px solid var(--border); }

                .phase-pill { padding: 0.5rem 1.25rem; border-radius: 50px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
                .phase-pill.applied { background: #e0f2fe; color: #0369a1; }
                .phase-pill.review { background: #fef9c3; color: #854d0e; }
                .phase-pill.interviewing { background: #e0e7ff; color: #4338ca; }
                .phase-pill.offered { background: #dcfce7; color: #15803d; border: 1px solid #166534; }
                .phase-pill.rejected { background: #fee2e2; color: #b91c1c; }

                .test-selector-pro { padding: 0.75rem; border-radius: 10px; border: 1.5px solid #e2e8f0; width: 100%; font-weight: 800; font-size: 0.8rem; cursor: pointer; color: var(--text-main); transition: var(--transition); }
                .test-selector-pro:hover { border-color: var(--primary); }
                .matrix-status { display: flex; flex-direction: column; gap: 0.4rem; }
                .matrix-badge { padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.65rem; font-weight: 900; text-align: center; }
                .matrix-badge.pending { background: #f1f5f9; color: var(--text-light); }
                .matrix-badge.completed { background: var(--success-light); color: var(--success); }
                .matrix-score { font-size: 0.75rem; font-weight: 850; color: var(--primary); text-align: center; }

                .pulse-info { max-width: 200px; }
                .pulse-note { font-size: 0.85rem; color: var(--text-main); font-weight: 600; margin-bottom: 0.3rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .pulse-info small { color: var(--text-light); font-weight: 800; font-size: 0.75rem; }

                .btn-op-update { display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; background: var(--text-main); color: white; border-radius: 12px; font-weight: 850; font-size: 0.8rem; transition: var(--transition); border: none; cursor: pointer; }
                .btn-op-update:hover { transform: translateY(-2px); box-shadow: var(--shadow-xl); background: black; }

                .empty-registry { padding: 5rem; text-align: center; color: var(--text-light); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .empty-registry p { font-weight: 800; font-size: 1.1rem; }

                .modal-backdrop-blur { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .phase-update-modal { width: 550px; padding: 3rem; background: white; border: 1px solid var(--border); }
                .modal-header-pro { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .modal-header-pro h3 { font-size: 1.5rem; font-weight: 950; display: flex; align-items: center; gap: 1rem; letter-spacing: -0.5px; }
                .btn-close-modal { background: #f1f5f9; border-radius: 12px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
                .btn-close-modal:hover { background: #e2e8f0; color: var(--danger); }

                .modal-body-pro { display: flex; flex-direction: column; gap: 2rem; }
                .input-group-pro label { display: block; font-weight: 900; font-size: 0.7rem; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.75rem; letter-spacing: 1px; }
                .input-group-pro select, .input-group-pro textarea { width: 100%; padding: 1.25rem; border-radius: 14px; border: 2px solid #edeff3; background: #f8fafc; font-family: inherit; font-size: 1rem; font-weight: 650; color: var(--text-main); transition: var(--transition); }
                .input-group-pro select:focus, .input-group-pro textarea:focus { border-color: var(--primary); background: white; outline: none; box-shadow: 0 0 0 4px var(--primary-light); }
                .input-group-pro textarea { resize: none; }

                .btn-save-phase { width: 100%; padding: 1.25rem; background: var(--primary); color: white; border-radius: 16px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 1rem; transition: var(--transition); border: none; cursor: pointer; margin-top: 1rem; font-size: 1rem; }
                .btn-save-phase:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.4); }
                .btn-save-phase:disabled { opacity: 0.5; cursor: not-allowed; }

                .loading-container { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; }
                .pulse-loader { width: 40px; height: 40px; background: var(--primary); border-radius: 50%; animation: pulse 1.5s infinite ease-in-out; }
                .loading-container p { font-weight: 850; color: var(--text-light); text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; }

                @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
            `}</style>
        </div>
    );
};
