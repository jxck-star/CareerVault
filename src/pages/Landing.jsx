import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../db/api';
import {
  Rocket, Briefcase, Users, BookOpen,
  ChevronRight, ArrowRight, Zap, Target,
  ShieldCheck, Globe, CheckCircle
} from 'lucide-react';

export const Landing = () => {
  const [stats, setStats] = useState({
    jobs: 0,
    users: 0,
    courses: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await publicApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Landing stats error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
        <div className="landing-page animate-fade-in">
            <nav className="guest-nav">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        Career Vault<span>.</span>
                    </Link>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                        <div className="nav-actions">
                            <Link to="/login" className="btn-text">Sign In</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <section className="hero-section">
                    <div className="hero-grid">
                        <div className="hero-text">
                            <div className="promo-badge">
                                <Zap size={14} />
                                <span>AI-Powered Talent Matching</span>
                            </div>
                            <h1>The Future of <br /><span className="text-primary">Professional</span> Recruitment.</h1>
                            <p>
                                Career Vault is a comprehensive career ecosystem. Secure your professional assets, 
                                optimize your trajectory with AI intelligence, and connect with the world's 
                                most innovative companies.
                            </p>
                            <div className="hero-cta">
                                <Link to="/register" className="btn-primary btn-lg">
                                    Create Your Account <ArrowRight size={18} />
                                </Link>
                                <a href="#features" className="btn-secondary btn-lg">
                                    Explore Platform
                                </a>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="visual-container premium-card">
                                <div className="visual-header">
                                    <div className="window-controls">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div className="window-title">AI Assessment Terminal</div>
                                </div>
                                <div className="visual-body">
                                    <div className="metrics-row">
                                        <div className="metric">
                                            <span className="label">Match Score</span>
                                            <span className="value">98.4%</span>
                                        </div>
                                        <div className="metric">
                                            <span className="label">Reliability</span>
                                            <span className="value text-success">High</span>
                                        </div>
                                    </div>
                                    <div className="visual-graph">
                                        <div className="graph-bar" style={{ height: '60%' }}></div>
                                        <div className="graph-bar active" style={{ height: '90%' }}></div>
                                        <div className="graph-bar" style={{ height: '75%' }}></div>
                                        <div className="graph-bar" style={{ height: '85%' }}></div>
                                        <div className="graph-bar" style={{ height: '55%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="floating-stat stat-1 premium-card">
                                <Users size={20} className="text-primary" />
                                <div>
                                    <strong>{stats.users}+</strong>
                                    <span>Active Users</span>
                                </div>
                            </div>
                            <div className="floating-stat stat-2 premium-card">
                                <Briefcase size={20} className="text-secondary" />
                                <div>
                                    <strong>{stats.jobs}+</strong>
                                    <span>Opportunities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="stats-strip">
                    <div className="stat-unit">
                        <Globe size={24} />
                        <div>
                            <strong>{stats.jobs}</strong>
                            <span>Live Openings</span>
                        </div>
                    </div>
                    <div className="stat-unit">
                        <BookOpen size={24} />
                        <div>
                            <strong>{stats.courses}</strong>
                            <span>Learning Paths</span>
                        </div>
                    </div>
                    <div className="stat-unit">
                        <ShieldCheck size={24} />
                        <div>
                            <strong>Enterprise</strong>
                            <span>Grade Security</span>
                        </div>
                    </div>
                </section>

                <section id="features" className="features-section">
                    <div className="section-intro">
                        <h2>One Platform. Three Powerful Roles.</h2>
                        <p>Tailored experiences for every stakeholder in the hiring process.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card premium-card">
                            <div className="feature-icon primary"><Target size={32} /></div>
                            <h3>For Appliers</h3>
                            <p>Automate your job search with AI-optimized resumes and professional roadmaps.</p>
                            <ul className="feature-list">
                                <li><CheckCircle size={16} /> ATS-Proof Resumes</li>
                                <li><CheckCircle size={16} /> Career Roadmaps</li>
                                <li><CheckCircle size={16} /> Skill Assessments</li>
                            </ul>
                            <Link to="/register" className="card-btn">Get Started <ChevronRight size={16} /></Link>
                        </div>

                        <div className="feature-card premium-card">
                            <div className="feature-icon secondary"><Briefcase size={32} /></div>
                            <h3>For HR & Recruiters</h3>
                            <p>Source, rank, and hire top talent using our proprietary AI matching engine.</p>
                            <ul className="feature-list">
                                <li><CheckCircle size={16} /> AI Candidate Ranking</li>
                                <li><CheckCircle size={16} /> Pipeline Management</li>
                                <li><CheckCircle size={16} /> Smart Job Postings</li>
                            </ul>
                            <Link to="/register" className="card-btn">Post a Job <ChevronRight size={16} /></Link>
                        </div>

                        <div className="feature-card premium-card">
                            <div className="feature-icon success"><Users size={32} /></div>
                            <h3>For Admin</h3>
                            <p>Complete control over your organization's talent ecosystem and visibility.</p>
                            <ul className="feature-list">
                                <li><CheckCircle size={16} /> User Management</li>
                                <li><CheckCircle size={16} /> Advanced Analytics</li>
                                <li><CheckCircle size={16} /> Platform Security</li>
                            </ul>
                            <Link to="/register" className="card-btn">Organization Hub <ChevronRight size={16} /></Link>
                        </div>
                    </div>
                </section>
            </main>

            <style>{`
                .landing-page { color: var(--text-main); }
                .guest-nav { height: 90px; display: flex; align-items: center; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; }
                .nav-container { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; }
                .nav-logo { font-size: 1.75rem; font-weight: 900; color: var(--text-main); text-decoration: none; font-family: 'Outfit', sans-serif; letter-spacing: -1px; }
                .nav-logo span { color: var(--primary); }
                .nav-links { display: flex; align-items: center; gap: 3rem; }
                .nav-links a { text-decoration: none; color: var(--text-light); font-weight: 600; font-size: 0.95rem; transition: var(--transition); }
                .nav-links a:hover { color: var(--primary); }
                .nav-actions { display: flex; align-items: center; gap: 1.5rem; }

                .hero-section { padding: 6rem 2rem; max-width: 1400px; margin: 0 auto; }
                .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 5rem; align-items: center; }
                .promo-badge { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.25rem; background: var(--primary-light); color: var(--primary); border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 2.5rem; }
                .hero-text h1 { font-size: 4.5rem; font-weight: 900; line-height: 1.1; letter-spacing: -3px; margin-bottom: 2rem; color: var(--bg-dark); }
                .hero-text p { font-size: 1.25rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 4rem; max-width: 600px; }
                .hero-cta { display: flex; gap: 1.5rem; }
                .btn-lg { padding: 1.25rem 2.5rem; font-size: 1rem; border-radius: var(--radius-lg); }

                .hero-visual { position: relative; }
                .visual-container { padding: 0; overflow: hidden; height: 380px; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.1); }
                .visual-header { background: #f8fafc; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .window-controls { display: flex; gap: 0.5rem; }
                .window-controls span { width: 10px; height: 10px; border-radius: 50%; background: #e2e8f0; }
                .window-title { font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; }
                .visual-body { padding: 2.5rem; }
                .metrics-row { display: flex; gap: 4rem; margin-bottom: 3rem; }
                .metric { display: flex; flex-direction: column; gap: 0.25rem; }
                .metric .label { font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; font-weight: 700; }
                .metric .value { font-size: 2rem; font-weight: 900; color: var(--primary); }
                .visual-graph { display: flex; align-items: flex-end; gap: 1rem; height: 120px; }
                .graph-bar { flex: 1; background: var(--bg-main); border-radius: 6px; transition: var(--transition); }
                .graph-bar.active { background: var(--primary); }
                .floating-stat { position: absolute; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; width: 220px; z-index: 10; transform: var(--transition); }
                .floating-stat:hover { transform: translateY(-5px); }
                .stat-1 { top: -40px; right: -20px; }
                .stat-2 { bottom: -30px; left: -40px; }
                .floating-stat strong { display: block; font-size: 1.25rem; }
                .floating-stat span { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

                .stats-strip { max-width: 1200px; margin: 0 auto; background: white; border-radius: var(--radius-2xl); border: 1px solid var(--border); padding: 3rem; display: flex; justify-content: space-around; box-shadow: 0 20px 50px -10px rgba(0,0,0,0.05); }
                .stat-unit { display: flex; align-items: center; gap: 2rem; }
                .stat-unit strong { display: block; font-size: 2.25rem; font-weight: 900; color: var(--bg-dark); letter-spacing: -1px; }
                .stat-unit span { font-size: 0.9rem; color: var(--text-muted); font-weight: 700; }

                .features-section { padding: 10rem 2rem; max-width: 1400px; margin: 0 auto; }
                .section-intro { text-align: center; margin-bottom: 6rem; }
                .section-intro h2 { font-size: 3rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 1.5rem; }
                .section-intro p { font-size: 1.1rem; color: var(--text-muted); max-width: 700px; margin: 0 auto; }

                .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
                .feature-card { padding: 3.5rem; text-align: left; }
                .feature-icon { width: 80px; height: 80px; border-radius: var(--radius-2xl); display: flex; align-items: center; justify-content: center; margin-bottom: 2.5rem; }
                .feature-icon.primary { background: var(--primary-light); color: var(--primary); }
                .feature-icon.secondary { background: var(--secondary-light); color: var(--secondary); }
                .feature-icon.success { background: var(--success-light); color: var(--success); }
                .feature-card h3 { font-size: 1.75rem; font-weight: 900; margin-bottom: 1rem; }
                .feature-card p { color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; }
                .feature-list { list-style: none; padding: 0; margin: 0 0 3rem; display: flex; flex-direction: column; gap: 1rem; }
                .feature-list li { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; font-size: 0.95rem; color: var(--text-main); }
                .feature-list li svg { color: var(--success); }
                .card-btn { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--primary); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; transition: var(--transition); }
                .card-btn:hover { gap: 0.75rem; }

                @media (max-width: 1200px) {
                    .hero-grid { grid-template-columns: 1fr; text-align: center; }
                    .hero-text p { margin-left: auto; margin-right: auto; }
                    .hero-cta { justify-content: center; }
                    .hero-visual { max-width: 600px; margin: 4rem auto 0; }
                    .stats-strip { flex-direction: column; gap: 3rem; align-items: center; }
                    .features-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 768px) {
                    .hero-text h1 { font-size: 3rem; }
                    .nav-links { display: none; }
                }
            `}</style>
        </div>
    );
};
