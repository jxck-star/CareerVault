import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import {
    User, Mail, Phone, MapPin, Globe, Linkedin, Github,
    Book, Briefcase, Code, Award, CheckCircle, Plus, Trash2, Save, FileText, AlertCircle, Calendar, GraduationCap
} from 'lucide-react';
import { ResumeUpload } from '../components/ResumeUpload';
import { ATSResumeGenerator } from '../components/ATSResumeGenerator';
import { AIRecommendations } from '../components/AIRecommendations';

export const Profile = () => {
    const { user } = useAuth();
    const { profile, loading, error, saveProfile } = useProfile();
    const [activeTab, setActiveTab] = useState('personal');

    if (loading) return (
        <div className="profile-loading">
            <div className="pulse-loader"></div>
            <p>Syncing Profile Vault...</p>
        </div>
    );

    if (error) return (
        <div className="profile-error">
            <AlertCircle size={48} color="var(--danger)" />
            <h2>Sync Failed</h2>
            <p>{error}</p>
        </div>
    );

    if (!profile && !loading) {
        const { logout } = useAuth();
        return (
            <div className="profile-error glass animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
                <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                <h2>Vault Synchronize Failed</h2>
                <p className="text-muted">We couldn't retrieve your profile data. This might happen if your session has expired or your account was reset.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                    <button className="save-btn" style={{ margin: 0 }} onClick={() => window.location.reload()}>Retry Synchronization</button>
                    <button className="save-btn" style={{ margin: 0, background: 'var(--danger)' }} onClick={() => { logout(); window.location.href = '/login'; }}>Sign Out & Reset Session</button>
                </div>
            </div>
        );
    }
    if (!profile) return null;

    const calculateCompletionScore = () => {
        let filled = 0;
        let total = 6;
        if (profile.name) filled++;
        if (profile.personal?.phone) filled++;
        if (profile.education && profile.education.length > 0) filled++;
        if (profile.experience && profile.experience.length > 0) filled++;
        if (profile.skills && profile.skills.length > 2) filled++;
        if (profile.certifications && profile.certifications.length > 0) filled++;
        return Math.round((filled / total) * 100);
    };

    const completionScore = calculateCompletionScore();

    return (
        <div className="profile-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Account Settings</h1>
                    <p>Manage your professional identity and data security.</p>
                </div>
            </header>

            <div className="profile-hero premium-card">
                <div className="hero-content">
                    <div className="profile-avatar">
                        {profile.name ? profile.name[0] : 'U'}
                    </div>
                    <div className="hero-text">
                        <h2>{profile.name || 'Anonymous User'}</h2>
                        <p>{profile.email || user?.email}</p>
                        <div className="profile-badges">
                            <span className="badge-pill success">Verified</span>
                            <span className="badge-pill primary">AI-Indexed</span>
                        </div>
                    </div>
                </div>
                <div className="profile-completion">
                    <div className="completion-label">
                        <span>Profile Completion</span>
                        <strong>{completionScore}%</strong>
                    </div>
                    <div className="progress-bar-lg">
                        <div className="progress-fill" style={{ width: `${completionScore}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="profile-layout">
                <aside className="profile-nav premium-card">
                    <button className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
                        <User size={18} /> Personal Details
                    </button>
                    <button className={`nav-link ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
                        <Book size={18} /> Academic History
                    </button>
                    <button className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>
                        <Briefcase size={18} /> Experience Portal
                    </button>
                    <button className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
                        <Code size={18} /> Expertise Matrix
                    </button>
                    <button className={`nav-link ${activeTab === 'certs' ? 'active' : ''}`} onClick={() => setActiveTab('certs')}>
                        <Award size={18} /> Certifications
                    </button>
                    <button className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
                        <FileText size={18} /> Resume Controls
                    </button>
                </aside>

                <main className="profile-main premium-card">
                    {activeTab === 'personal' && (
                        <div className="section-container">
                            <ResumeUpload profile={profile} onParsed={saveProfile} />
                            <PersonalSection profile={profile} onSave={saveProfile} />
                        </div>
                    )}
                    {activeTab === 'education' && <EducationSection profile={profile} onSave={saveProfile} />}
                    {activeTab === 'experience' && <ExperienceSection profile={profile} onSave={saveProfile} />}
                    {activeTab === 'skills' && <SkillsOverhaulSection profile={profile} onSave={saveProfile} />}
                    {activeTab === 'certs' && <CertificationsSection profile={profile} onSave={saveProfile} />}
                    {activeTab === 'resume' && (
                        <div className="resume-content animate-fade-in">
                            <div className="section-intro">
                                <h3>Resume Intelligence</h3>
                                <p>Generate optimized documents based on your verified profile data.</p>
                            </div>
                            <ATSResumeGenerator profile={profile} />
                            <AIRecommendations profile={profile} />
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .profile-page { padding-bottom: 5rem; }
                
                .profile-hero { display: flex; justify-content: space-between; align-items: center; padding: 2.5rem; margin-bottom: 2.5rem; gap: 3rem; }
                .hero-content { display: flex; align-items: center; gap: 2rem; }
                .profile-avatar { width: 100px; height: 100px; background: var(--primary); color: white; border-radius: var(--radius-2xl); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; box-shadow: 0 10px 20px -5px var(--primary); }
                .hero-text h2 { font-size: 2rem; font-weight: 900; margin-bottom: 0.25rem; }
                .hero-text p { color: var(--text-muted); margin-bottom: 0.75rem; }
                .profile-badges { display: flex; gap: 0.75rem; }
                
                .profile-completion { width: 320px; }
                .completion-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.9rem; font-weight: 700; }
                .progress-bar-lg { height: 10px; background: var(--bg-main); border-radius: 5px; overflow: hidden; }
                .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--success)); border-radius: 5px; transition: width 1s ease; }

                .profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 2.5rem; align-items: flex-start; }
                .profile-nav { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; position: sticky; top: 110px; }
                .nav-link { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: var(--radius-md); color: var(--text-light); font-weight: 700; transition: var(--transition); border: none; background: none; cursor: pointer; text-align: left; }
                .nav-link:hover { background: var(--bg-main); color: var(--primary); }
                .nav-link.active { background: var(--primary-light); color: var(--primary); }
                
                .profile-main { padding: 3rem; min-height: 600px; }
                .section-container { display: flex; flex-direction: column; gap: 3rem; }
                .section-intro { margin-bottom: 2.5rem; }
                .section-intro h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem; }
                .section-intro p { color: var(--text-muted); }

                .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .full-width { grid-column: span 2; }
                .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.75rem; }
                .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-md); background: #f8fafc; font-family: inherit; font-size: 1rem; transition: var(--transition); }
                .form-group input:focus { border-color: var(--primary); background: white; outline: none; box-shadow: 0 0 0 4px var(--primary-light); }

                .entry-card { position: relative; padding: 2.5rem; background: var(--bg-main); border-radius: var(--radius-lg); margin-bottom: 2.5rem; border: 1px solid transparent; transition: var(--transition); }
                .entry-card:hover { border-color: var(--primary); background: white; box-shadow: var(--shadow-md); }
                .delete-btn { position: absolute; top: 1rem; right: 1rem; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fef2f2; color: #ef4444; border: none; cursor: pointer; transition: var(--transition); }
                .delete-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }

                .add-btn { width: 100%; padding: 1.25rem; border: 2px dashed var(--border); border-radius: var(--radius-lg); color: var(--primary); font-weight: 800; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1rem; transition: var(--transition); }
                .add-btn:hover { border-color: var(--primary); background: var(--primary-light); }
                
                .skill-type-section { margin-bottom: 2.5rem; }
                .skill-type-section h4 { font-size: 0.9rem; font-weight: 800; color: var(--text-light); margin-bottom: 1rem; text-transform: uppercase; }
                .skill-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .skill-tag { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: white; border: 1px solid var(--border); border-radius: var(--radius-md); font-weight: 700; font-size: 0.9rem; }
                .skill-tag small { color: var(--primary); opacity: 0.7; }
                .skill-tag.remove { cursor: pointer; color: var(--text-light); }
                .skill-tag.remove:hover { color: #ef4444; }

                @media (max-width: 1024px) {
                    .profile-layout { grid-template-columns: 1fr; }
                    .profile-nav { flex-direction: row; position: static; overflow-x: auto; padding: 1rem; }
                    .nav-link { white-space: nowrap; }
                    .profile-hero { flex-direction: column; text-align: center; gap: 2rem; }
                    .hero-content { flex-direction: column; }
                    .profile-completion { width: 100%; }
                }
                @media (max-width: 768px) {
                    .grid-form { grid-template-columns: 1fr; }
                    .full-width { grid-column: span 1; }
                    .profile-main { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

const PersonalSection = ({ profile, onSave }) => {
    const [data, setData] = useState({ 
        name: profile.name, 
        email: profile.email, 
        ...profile.personal 
    });
    useEffect(() => { 
        setData({ 
            name: profile.name, 
            email: profile.email, 
            ...profile.personal 
        }); 
    }, [profile]);

    return (
        <div className="animate-fade-in">
            <div className="section-intro">
                <h3>Personal Identity</h3>
                <p>Ensure your contact information is up to date for recruiters.</p>
            </div>
            <div className="grid-form">
                <div className="form-group">
                    <label><User size={14} /> Full Name</label>
                    <input type="text" value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div className="form-group">
                    <label><Mail size={14} /> Email Address</label>
                    <input type="email" value={data.email || ''} onChange={e => setData({...data, email: e.target.value})} placeholder="email@example.com" />
                </div>
                <div className="form-group">
                    <label><Phone size={14} /> Contact Number</label>
                    <input type="text" value={data.phone || ''} onChange={e => setData({...data, phone: e.target.value})} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                    <label><MapPin size={14} /> Physical Location</label>
                    <input type="text" value={data.address || ''} onChange={e => setData({...data, address: e.target.value})} placeholder="City, Country" />
                </div>
                <div className="form-group">
                    <label><Linkedin size={14} /> LinkedIn Profile</label>
                    <input type="text" value={data.linkedin || ''} onChange={e => setData({...data, linkedin: e.target.value})} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="form-group">
                    <label><Globe size={14} /> Digital Portfolio</label>
                    <input type="text" value={data.portfolio || ''} onChange={e => setData({...data, portfolio: e.target.value})} placeholder="https://yourportfolio.com" />
                </div>
                <div className="form-group full-width">
                    <label>Executive Bio</label>
                    <textarea rows="5" value={data.bio || ''} onChange={e => setData({...data, bio: e.target.value})} placeholder="Write a compelling summary of your professional journey and aspirations..."></textarea>
                </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '2.5rem' }} onClick={() => {
                const { name, email, ...personal } = data;
                onSave({ ...profile, name, personal });
            }}><Save size={18} /> Update Profile</button>
        </div>
    );
};

const EducationSection = ({ profile, onSave }) => {
    const [entries, setEntries] = useState(profile.education || []);
    useEffect(() => { setEntries(profile.education || []); }, [profile.education]);

    const addEntry = () => {
        setEntries([...entries, { degree: 'Undergraduate', school: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' }]);
    };

    const removeEntry = (idx) => {
        const newEntries = entries.filter((_, i) => i !== idx);
        setEntries(newEntries);
        onSave({...profile, education: newEntries});
    };

    const updateEntry = (idx, field, val) => {
        const newEntries = [...entries];
        newEntries[idx][field] = val;
        setEntries(newEntries);
    };

    return (
        <div className="animate-fade-in">
            <div className="section-intro">
                <h3>Academic Foundation</h3>
                <p>List your educational milestones to demonstrate your expertise.</p>
            </div>
            {entries.length === 0 ? (
                <div className="empty-state premium-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <GraduationCap size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
                    <p>No education records added yet.</p>
                </div>
            ) : entries.map((edu, idx) => (
                <div key={idx} className="entry-card">
                    <button className="delete-btn" onClick={() => removeEntry(idx)}><Trash2 size={18} /></button>
                    <div className="grid-form">
                        <div className="form-group">
                            <label><GraduationCap size={14} /> Qualification</label>
                            <select value={edu.degree} onChange={e => updateEntry(idx, 'degree', e.target.value)}>
                                <option>10th Standard</option>
                                <option>12th Standard</option>
                                <option>Diploma</option>
                                <option>Undergraduate</option>
                                <option>Postgraduate</option>
                                <option>PhD</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Institution</label>
                            <input type="text" value={edu.school} onChange={e => updateEntry(idx, 'school', e.target.value)} placeholder="e.g. University of Mumbai" />
                        </div>
                        <div className="form-group">
                            <label>Field of Study</label>
                            <input type="text" value={edu.fieldOfStudy} onChange={e => updateEntry(idx, 'fieldOfStudy', e.target.value)} placeholder="e.g. Computer Science" />
                        </div>
                        <div className="form-group">
                            <label>CGPA / Percentage</label>
                            <input type="text" value={edu.grade} onChange={e => updateEntry(idx, 'grade', e.target.value)} placeholder="e.g. 9.5" />
                        </div>
                        <div className="form-group">
                            <label><Calendar size={14} /> Start Year</label>
                            <input type="text" value={edu.startYear} onChange={e => updateEntry(idx, 'startYear', e.target.value)} placeholder="2018" />
                        </div>
                        <div className="form-group">
                            <label><Calendar size={14} /> Completion Year</label>
                            <input type="text" value={edu.endYear} onChange={e => updateEntry(idx, 'endYear', e.target.value)} placeholder="2022" />
                        </div>
                    </div>
                </div>
            ))}
            <button className="add-btn" onClick={addEntry}><Plus size={18} /> Add Qualification</button>
            <button className="btn-primary" style={{ marginTop: '2.5rem' }} onClick={() => onSave({...profile, education: entries})}><Save size={18} /> Sync Records</button>
        </div>
    );
};

const ExperienceSection = ({ profile, onSave }) => {
    const [entries, setEntries] = useState(profile.experience || []);
    useEffect(() => { setEntries(profile.experience || []); }, [profile.experience]);

    const addEntry = () => {
        setEntries([...entries, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
    };

    const removeEntry = (idx) => {
        const newEntries = entries.filter((_, i) => i !== idx);
        setEntries(newEntries);
        onSave({...profile, experience: newEntries});
    };

    const updateEntry = (idx, field, val) => {
        const newEntries = [...entries];
        newEntries[idx][field] = val;
        setEntries(newEntries);
    };

    return (
        <div className="animate-fade-in">
            <div className="section-intro">
                <h3>Professional Journey</h3>
                <p>Detail your career path, focusing on impact and measurable results.</p>
            </div>
            {entries.length === 0 ? (
                <div className="empty-state premium-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Briefcase size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
                    <p>No work history documented yet.</p>
                </div>
            ) : entries.map((exp, idx) => (
                <div key={idx} className="entry-card">
                    <button className="delete-btn" onClick={() => removeEntry(idx)}><Trash2 size={18} /></button>
                    <div className="grid-form">
                        <div className="form-group">
                            <label><Briefcase size={14} /> Company</label>
                            <input type="text" value={exp.company} onChange={e => updateEntry(idx, 'company', e.target.value)} placeholder="e.g. Google" />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <input type="text" value={exp.position} onChange={e => updateEntry(idx, 'position', e.target.value)} placeholder="e.g. Backend Lead" />
                        </div>
                        <div className="form-group">
                            <label><Calendar size={14} /> Start Date</label>
                            <input type="text" value={exp.startDate} onChange={e => updateEntry(idx, 'startDate', e.target.value)} placeholder="Jan 2020" />
                        </div>
                        <div className="form-group">
                            <label><Calendar size={14} /> End Date</label>
                            <input type="text" value={exp.endDate} onChange={e => updateEntry(idx, 'endDate', e.target.value)} placeholder="Dec 2022" />
                        </div>
                        <div className="form-group full-width">
                            <label>Responsibilities & Achievements</label>
                            <textarea rows="6" value={exp.description} onChange={e => updateEntry(idx, 'description', e.target.value)} placeholder="Use impact-driven language..."></textarea>
                        </div>
                    </div>
                </div>
            ))}
            <button className="add-btn" onClick={addEntry}><Plus size={18} /> Add Professional Role</button>
            <button className="btn-primary" style={{ marginTop: '2.5rem' }} onClick={() => onSave({...profile, experience: entries})}><Save size={18} /> Sync Experience</button>
        </div>
    );
};

const SkillsOverhaulSection = ({ profile, onSave }) => {
    const [skills, setSkills] = useState(profile.skills || []);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'Technical', level: 'Intermediate' });

    const addSkill = () => {
        if (!newSkill.name) return;
        const updated = [...skills, newSkill];
        setSkills(updated);
        onSave({...profile, skills: updated});
        setNewSkill({ name: '', category: 'Technical', level: 'Intermediate' });
    };

    const removeSkill = (idx) => {
        const updated = skills.filter((_, i) => i !== idx);
        setSkills(updated);
        onSave({...profile, skills: updated});
    };

    const categories = ['Technical', 'Soft Skills', 'Tools', 'Frameworks'];

    return (
        <div className="animate-fade-in">
            <div className="section-intro">
                <h3>Expertise Matrix</h3>
                <p>Categorize your skills to help our AI match you with premium roles.</p>
            </div>
            
            <div className="entry-card" style={{ borderStyle: 'dashed', background: 'var(--bg-main)' }}>
                <div className="grid-form">
                    <div className="form-group">
                        <label>Skill Name</label>
                        <input type="text" placeholder="e.g. React" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Proficiency</label>
                        <select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn-primary" onClick={addSkill} style={{ width: '100%', justifyContent: 'center', height: '100%' }}><Plus size={18} /> Add Skill</button>
                    </div>
                </div>
            </div>

            <div className="skills-categories" style={{ marginTop: '3rem' }}>
                {categories.map(cat => (
                    <div key={cat} className="skill-type-section">
                        <h4>{cat}</h4>
                        <div className="skill-tags">
                            {skills.filter(s => s.category === cat || (!s.category && cat === 'Technical')).length > 0 ? 
                                skills.filter(s => s.category === cat || (!s.category && cat === 'Technical')).map((s, idx) => (
                                <div key={idx} className="skill-tag">
                                    <span>{s.name} <small>{s.level}</small></span>
                                    <Trash2 size={14} className="remove" onClick={() => removeSkill(skills.indexOf(s))} />
                                </div>
                            )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No entries yet.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CertificationsSection = ({ profile, onSave }) => {
    const [entries, setEntries] = useState(profile.certifications || []);
    useEffect(() => { setEntries(profile.certifications || []); }, [profile.certifications]);

    const addEntry = () => {
        setEntries([...entries, { name: '', organization: '', date: '', link: '' }]);
    };

    const removeEntry = (idx) => {
        const newEntries = entries.filter((_, i) => i !== idx);
        setEntries(newEntries);
        onSave({...profile, certifications: newEntries});
    };

    const updateEntry = (idx, field, val) => {
        const newEntries = [...entries];
        newEntries[idx][field] = val;
        setEntries(newEntries);
    };

    return (
        <div className="animate-fade-in">
            <div className="section-intro">
                <h3>Verified Credentials</h3>
                <p>Showcase your certificates and specializations.</p>
            </div>
            {entries.length === 0 ? (
                <div className="empty-state premium-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Award size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
                    <p>No certifications added yet.</p>
                </div>
            ) : entries.map((cert, idx) => (
                <div key={idx} className="entry-card">
                    <button className="delete-btn" onClick={() => removeEntry(idx)}><Trash2 size={18} /></button>
                    <div className="grid-form">
                        <div className="form-group">
                            <label><Award size={14} /> Credential</label>
                            <input type="text" value={cert.name} onChange={e => updateEntry(idx, 'name', e.target.value)} placeholder="e.g. AWS Certified" />
                        </div>
                        <div className="form-group">
                            <label>Issuer</label>
                            <input type="text" value={cert.organization} onChange={e => updateEntry(idx, 'organization', e.target.value)} placeholder="e.g. Amazon" />
                        </div>
                        <div className="form-group">
                            <label><Calendar size={14} /> Achievement Date</label>
                            <input type="text" value={cert.date} onChange={e => updateEntry(idx, 'date', e.target.value)} placeholder="March 2024" />
                        </div>
                        <div className="form-group">
                            <label><Globe size={14} /> Verification Link</label>
                            <input type="text" value={cert.link} onChange={e => updateEntry(idx, 'link', e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                </div>
            ))}
            <button className="add-btn" onClick={addEntry}><Plus size={18} /> Add Credential</button>
            <button className="btn-primary" style={{ marginTop: '2.5rem' }} onClick={() => onSave({...profile, certifications: entries})}><Save size={18} /> Sync Certs</button>
        </div>
    );
};

