import React, { useState } from 'react';
import { jobApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { 
    Briefcase, MapPin, Plus, Sparkles, 
    Trash2, Save, FileText, Globe, Layers, CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PostJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState({
        title: '',
        company: user?.company || 'Your Company',
        description: '',
        location: '',
        salary: '',
        skills: [],
        type: 'Full-time'
    });
    const [skillInput, setSkillInput] = useState('');

    const handlePost = async (e) => {
        e.preventDefault();
        if (!job.title || !job.skills.length) return alert('Please fill title and skills');

        try {
            setLoading(true);
            await jobApi.create({
                ...job,
                hrId: user._id || user.id
            });
            navigate('/hr-dashboard');
        } catch (err) {
            console.error("Post job error:", err);
            alert("Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    const extractSkills = () => {
        const commonSkills = ['React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Testing', 'CSS', 'JavaScript', 'TypeScript', 'Figma', 'MongoDB'];
        const found = commonSkills.filter(s => job.description.toLowerCase().includes(s.toLowerCase()));
        setJob({ ...job, skills: [...new Set([...job.skills, ...found])] });
    };

    return (
        <div className="post-job-page animate-fade-in">
            <div className="page-header-section">
                <div>
                    <h1>Recruitment Deployment</h1>
                    <p>Configure the parameters to attract elite talent from the global pool.</p>
                </div>
                <div className="header-meta-badge">Career Vault Core v2.4</div>
            </div>

            <div className="post-job-grid">
                <div className="post-form-pane premium-card">
                    <form onSubmit={handlePost} className="deployment-form">
                        <div className="form-group-label">
                            <Layers size={18} />
                            <span>Core Specifications</span>
                        </div>
                        
                        <div className="input-group">
                            <label>Opportunity Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Senior Backend Architect" 
                                value={job.title} 
                                onChange={e => setJob({ ...job, title: e.target.value })} 
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label><Briefcase size={14} /> Organization</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Career Vault Labs" 
                                    value={job.company} 
                                    onChange={e => setJob({ ...job, company: e.target.value })} 
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label><MapPin size={14} /> Global Hub / Office</label>
                                <input 
                                    type="text" 
                                    placeholder="Remote / Mumbai / NYC" 
                                    value={job.location} 
                                    onChange={e => setJob({ ...job, location: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label><span className="currency-symbol">₹</span> Target Compensation</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. ₹15L - ₹25L" 
                                    value={job.salary} 
                                    onChange={e => setJob({ ...job, salary: e.target.value })} 
                                />
                            </div>
                            <div className="input-group">
                                <label><Globe size={14} /> Contract Type</label>
                                <select value={job.type} onChange={e => setJob({...job, type: e.target.value})}>
                                    <option>Full-time</option>
                                    <option>Contract</option>
                                    <option>Part-time</option>
                                    <option>Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-bar">
                                <label><FileText size={14} /> Mission Description</label>
                                <button type="button" className="btn-ai-assist" onClick={extractSkills}>
                                    <Sparkles size={14} /> AI Context Sync
                                </button>
                            </div>
                            <textarea 
                                rows="8" 
                                placeholder="Detail the technical challenges and organizational impact..." 
                                value={job.description} 
                                onChange={e => setJob({ ...job, description: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group-label mt-8">
                            <CheckCircle size={18} />
                            <span>Capability Requirements</span>
                        </div>

                        <div className="skill-deployment">
                            <div className="skill-input-bar">
                                <input 
                                    type="text" 
                                    placeholder="Add specialized expertise..." 
                                    value={skillInput} 
                                    onChange={e => setSkillInput(e.target.value)} 
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (skillInput.trim()) {
                                                setJob({ ...job, skills: [...new Set([...job.skills, skillInput.trim()])] });
                                                setSkillInput('');
                                            }
                                        }
                                    }}
                                />
                                <button type="button" className="btn-add-skill" onClick={() => {
                                    if (skillInput.trim()) {
                                        setJob({ ...job, skills: [...new Set([...job.skills, skillInput.trim()])] });
                                        setSkillInput('');
                                    }
                                }}><Plus size={20} /></button>
                            </div>
                            <div className="skill-matrix">
                                {job.skills.map((s, idx) => (
                                    <div key={idx} className="matrix-pill">
                                        <span>{s}</span>
                                        <button type="button" className="remove-pill" onClick={() => setJob({ ...job, skills: job.skills.filter((_, i) => i !== idx) })}>
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {job.skills.length === 0 && <p className="empty-hint">Define candidate specifications above.</p>}
                            </div>
                        </div>

                        <div className="deployment-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/hr-dashboard')}>Discard Session</button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Processing...' : 'Deploy to Pipeline'}
                                <Save size={18} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="preview-pane desktop-only">
                    <div className="preview-card-premium premium-card">
                        <div className="preview-header">
                            <div className="preview-badge">Live Synchronized Preview</div>
                            <div className="org-meta">
                                <div className="org-icon"><Briefcase size={22} /></div>
                                <div>
                                    <h5>{job.company || 'Career Vault Organization'}</h5>
                                    <span className="live-tag"><Globe size={10} /> Active Node</span>
                                </div>
                            </div>
                        </div>
                        <div className="preview-body">
                            <h3>{job.title || 'Architectural Lead'}</h3>
                            <div className="meta-strip">
                                <span><MapPin size={12} /> {job.location || 'Global Hub'}</span>
                                <span><span className="currency-symbol">₹</span> {job.salary || 'Executive Package'}</span>
                            </div>
                            <div className="desc-snippet">
                                {job.description ? job.description.substring(0, 180) + '...' : 'Your opportunity description will materialize here as you type in the deployment terminal...'}
                            </div>
                            <div className="skill-summary">
                                {job.skills.slice(0, 4).map((s, i) => (
                                    <span key={i} className="summary-chip">{s}</span>
                                ))}
                                {job.skills.length > 4 && <span className="more-count">+{job.skills.length - 4} More</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .post-job-page { display: flex; flex-direction: column; gap: 3rem; }
                .page-header-section { display: flex; justify-content: space-between; align-items: flex-start; }
                .page-header-section h1 { font-size: 2.5rem; font-weight: 950; letter-spacing: -1.5px; }
                .page-header-section p { color: var(--text-muted); font-weight: 600; font-size: 1.1rem; }
                .header-meta-badge { background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 850; color: var(--primary); border: 1px solid var(--border); }

                .post-job-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: flex-start; }
                .post-form-pane { padding: 3rem; }
                
                .form-group-label { display: flex; align-items: center; gap: 0.75rem; font-weight: 850; font-size: 1rem; color: var(--text-main); margin-bottom: 2rem; }
                .mt-8 { margin-top: 3rem; }

                .deployment-form { display: flex; flex-direction: column; gap: 1.75rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .input-group label { display: block; font-size: 0.75rem; font-weight: 850; color: var(--text-light); text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.5px; }
                .deployment-form input, .deployment-form select, .deployment-form textarea { width: 100%; padding: 0.9rem 1.25rem; background: #f8fafc; border: 2px solid #edeff3; border-radius: var(--radius-md); font-weight: 600; color: var(--text-main); transition: var(--transition); }
                .deployment-form input:focus, .deployment-form select:focus, .deployment-form textarea:focus { background: white; border-color: var(--primary-light); outline: none; box-shadow: 0 0 0 4px var(--primary-light); }
                
                .label-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
                .btn-ai-assist { font-size: 0.75rem; font-weight: 850; color: var(--primary); background: var(--primary-light); padding: 0.4rem 0.8rem; border-radius: 8px; display: flex; align-items: center; gap: 0.4rem; transition: var(--transition); }
                .btn-ai-assist:hover { background: var(--primary); color: white; transform: translateY(-1px); }

                .skill-input-bar { display: flex; gap: 0.75rem; }
                .btn-add-skill { background: var(--text-main); color: white; width: 55px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
                .btn-add-skill:hover { transform: scale(1.05); background: black; }

                .skill-matrix { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
                .matrix-pill { background: white; border: 1px solid var(--border); padding: 0.6rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 750; box-shadow: var(--shadow-sm); animation: slideIn 0.3s ease-out; }
                .remove-pill { color: #94a3b8; transition: var(--transition); }
                .remove-pill:hover { color: var(--danger); }

                .deployment-actions { margin-top: 3rem; display: flex; justify-content: flex-end; gap: 1.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }

                .preview-pane { position: sticky; top: 100px; }
                .preview-card-premium { padding: 2.5rem; background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%); border: 1px dashed var(--primary-light); }
                .preview-badge { display: inline-block; font-size: 0.65rem; font-weight: 900; background: var(--primary); color: white; padding: 0.3rem 0.8rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
                .org-meta { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; }
                .org-icon { width: 50px; height: 50px; background: white; color: var(--text-main); border: 2px solid var(--border); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .org-meta h5 { font-size: 1.15rem; font-weight: 850; }
                .live-tag { font-size: 0.7rem; color: var(--primary); font-weight: 850; display: flex; align-items: center; gap: 0.3rem; margin-top: 0.2rem; }
                
                .preview-body h3 { font-size: 1.75rem; font-weight: 950; letter-spacing: -0.5px; margin-bottom: 0.75rem; color: var(--text-main); }
                .meta-strip { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
                .meta-strip span { font-size: 0.85rem; color: var(--text-light); font-weight: 750; display: flex; align-items: center; gap: 0.4rem; }
                .currency-symbol { font-weight: 950; color: var(--success); }
                .desc-snippet { font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; margin-bottom: 2rem; }
                .skill-summary { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .summary-chip { font-size: 0.75rem; font-weight: 850; padding: 0.4rem 0.8rem; background: var(--text-main); color: white; border-radius: 8px; }
            `}</style>
        </div>
    );
};

const X = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
