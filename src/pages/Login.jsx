import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock, Shield, ChevronRight, Zap, CheckCircle2, Award } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            if (res.user.role === 'HR') navigate('/hr-dashboard');
            else if (res.user.role === 'ADMIN') navigate('/admin-dashboard');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-matrix animate-fade-in">
            <div className="auth-vignette"></div>
            
            <div className="auth-split-layout">
                {/* Visual Side */}
                <div className="auth-visual-panel">
                    <div className="visual-content">
                        <div className="brand-elite">
                            <Shield size={40} strokeWidth={2.5} />
                            <span>CAREER VAULT</span>
                        </div>
                        
                        <div className="visual-hero-text">
                            <h2>Find Your <br />Dream Job Today.</h2>
                            <p>Login to access top jobs and connect with leading employers in India.</p>
                        </div>


                        <div className="trust-indicators-premium">
                            <div className="trust-item">
                                <CheckCircle2 size={18} />
                                <span>ISO 27001 Data Security</span>
                            </div>
                            <div className="trust-item">
                                <Award size={18} />
                                <span>AI-Driven Verification</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="visual-footer">
                        <p>© 2026 Career Vault Technologies. All rights reserved.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="auth-form-panel">
                    <div className="form-container-premium shadow-premium">
                        <div className="form-head-premium">
                            <h1>Login to Your Account</h1>
                            <p>Please enter your email and password to continue.</p>
                        </div>


                        {error && (
                            <div className="error-node animate-shake">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="premium-auth-flow">
                            <div className="float-input-group">
                                <label>Email Address</label>
                                <div className="input-wrapper-premium">
                                    <Mail size={18} className="input-icon-premium" />
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>


                            <div className="float-input-group">
                                <div className="label-row-premium">
                                    <label>Password</label>
                                    <Link to="/forgot-password">Forgot password?</Link>
                                </div>

                                <div className="input-wrapper-premium">
                                    <Lock size={18} className="input-icon-premium" />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="auth-persistence">
                                <label className="custom-checkbox-premium">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span>Preserve session integrity</span>
                                </label>
                            </div>

                            <button type="submit" className="btn-auth-master">
                                Authenticate Access <ChevronRight size={18} />
                            </button>
                        </form>

                        <div className="auth-alt-entry">
                            <span>Diagnostic Entry Modes</span>
                            <div className="demo-access-strip">
                                <button className="demo-chip" onClick={() => { setEmail('applier@user.com'); setPassword('user'); }}>Applier</button>
                                <button className="demo-chip" onClick={() => { setEmail('hr@google.com'); setPassword('hr'); }}>HR Strategic</button>
                                <button className="demo-chip admin" onClick={() => { setEmail('admin@careervault.com'); setPassword('admin'); }}>Overseer</button>
                            </div>
                        </div>

                        <div className="auth-onboarding-link">
                            <p>New to the ecosystem? <Link to="/register">Register your professional identity</Link></p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-matrix { min-height: 100vh; position: relative; background: #fafafa; font-family: 'Inter', sans-serif; overflow: hidden; }
                .auth-vignette { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.02) 100%); pointer-events: none; }
                
                .auth-split-layout { display: flex; min-height: 100vh; }
                
                .auth-visual-panel { flex: 1.2; background: var(--bg-dark); color: white; padding: 4rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
                .auth-visual-panel::before { content: ''; position: absolute; top: -10%; right: -10%; width: 60%; height: 60%; background: var(--primary); filter: blur(120px); opacity: 0.15; border-radius: 50%; }
                
                .brand-elite { display: flex; align-items: center; gap: 1rem; font-weight: 950; font-size: 1.5rem; letter-spacing: 2px; color: white; }
                
                .visual-hero-text h2 { font-size: 4rem; font-weight: 900; line-height: 1.1; letter-spacing: -2px; margin-bottom: 2rem; }
                .visual-hero-text p { font-size: 1.25rem; opacity: 0.7; max-width: 500px; line-height: 1.6; font-weight: 500; }
                
                .trust-indicators-premium { display: flex; gap: 3rem; margin-top: 4rem; }
                .trust-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 700; color: var(--primary); }
                .trust-item span { color: white; opacity: 0.6; }
                
                .visual-footer { font-size: 0.85rem; opacity: 0.4; font-weight: 600; }

                .auth-form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem; background: white; border-left: 1px solid var(--border); }
                
                .form-container-premium { width: 100%; max-width: 480px; }
                .form-head-premium h1 { font-size: 2.5rem; font-weight: 950; letter-spacing: -1.5px; margin-bottom: 0.5rem; color: var(--text-main); }
                .form-head-premium p { color: var(--text-muted); font-weight: 600; font-size: 1.05rem; margin-bottom: 3rem; }
                
                .error-node { background: #fee2e2; color: #dc2626; padding: 1rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 800; border: 1px solid #fecaca; }
                
                .premium-auth-flow { display: flex; flex-direction: column; gap: 2rem; }
                .float-input-group label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
                .label-row-premium { display: flex; justify-content: space-between; align-items: flex-end; }
                .label-row-premium a { font-size: 0.8rem; font-weight: 800; color: var(--primary); text-transform: none; letter-spacing: 0; margin-bottom: 0.75rem; }
                
                .input-wrapper-premium { position: relative; }
                .input-icon-premium { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-light); transition: var(--transition); }
                .input-wrapper-premium input { width: 100%; padding: 1.25rem 1.25rem 1.25rem 3.5rem; background: var(--bg-main); border: 2px solid var(--border); border-radius: 18px; font-size: 1.05rem; font-weight: 700; color: var(--text-main); transition: var(--transition); }
                .input-wrapper-premium input:focus { background: white; border-color: var(--primary); outline: none; box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.1); }
                .input-wrapper-premium input:focus + .input-icon-premium { color: var(--primary); }
                
                .auth-persistence { margin-top: 0.5rem; }
                .custom-checkbox-premium { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-size: 0.95rem; font-weight: 700; color: var(--text-muted); }
                
                .btn-auth-master { background: var(--bg-dark); color: white; padding: 1.25rem; border-radius: 18px; font-size: 1.15rem; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; transition: var(--transition); margin-top: 1rem; border: none; }
                .btn-auth-master:hover { background: #000; transform: translateY(-3px); box-shadow: 0 12px 24px -6px rgba(0,0,0,0.25); }
                
                .auth-alt-entry { margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px dashed var(--border); }
                .auth-alt-entry span { display: block; font-size: 0.7rem; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.25rem; }
                .demo-access-strip { display: flex; gap: 0.75rem; }
                .demo-chip { flex: 1; padding: 0.75rem; border: 1px solid var(--border); background: white; border-radius: 12px; font-size: 0.8rem; font-weight: 800; cursor: pointer; transition: var(--transition); }
                .demo-chip:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
                .demo-chip.admin:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-light); }

                .auth-onboarding-link { margin-top: 3rem; text-align: center; }
                .auth-onboarding-link p { font-size: 1rem; font-weight: 600; color: var(--text-muted); }
                .auth-onboarding-link a { color: var(--primary); font-weight: 900; }

                @media (max-width: 1100px) {
                    .auth-visual-panel { display: none; }
                    .auth-form-panel { background: #fafafa; }
                    .form-container-premium { background: white; padding: 4rem; border-radius: 32px; border: 1px solid var(--border); }
                }
                @media (max-width: 600px) {
                    .auth-form-panel { padding: 1.5rem; }
                    .form-container-premium { padding: 2.5rem; }
                }
            `}</style>
        </div>
    );
};

export default Login;
