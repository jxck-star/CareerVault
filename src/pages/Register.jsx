import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Lock, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Loader, Award, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        education: 'Undergraduate',
        careerInterest: '',
        company: '',
        role: 'APPLIER', // Default role
        agreeToTerms: false
    });
    const [otp, setOtp] = useState('');
    const [simulatedOtp] = useState('123456');

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('Please fill in all the required fields.');
            return false;
        }
        if (formData.role === 'HR' && !formData.company) {
            setError('Please provide your Company Name.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        if (!formData.agreeToTerms) {
            setError('Please agree to our Terms and Conditions.');
            return false;
        }

        return true;
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (validateForm()) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setStep(2);
            }, 1200);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (otp !== simulatedOtp) {
            setError('Invalid Verification Code. [Demo: 123456]');
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            education: formData.education,
            careerInterest: formData.careerInterest,
            company: formData.company,
            role: formData.role
        });

        if (result.success) {
            if (result.user.role === 'HR') navigate('/hr-dashboard');
            else navigate('/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
            setStep(1);
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
                            <ShieldCheck size={40} strokeWidth={2.5} />
                            <span>CAREER VAULT</span>
                        </div>
                        
                        <div className="visual-hero-text">
                            <h2>Empowering Your <br />Career Growth.</h2>
                            <p>Sign up now to access top job opportunities and hire the best talent in India.</p>
                        </div>

                        <div className="trust-indicators-premium">
                            <div className="trust-item">
                                <CheckCircle2 size={18} />
                                <span>Verified Employers</span>
                            </div>
                            <div className="trust-item">
                                <Award size={18} />
                                <span>Free Career Coaching</span>
                            </div>
                        </div>

                    </div>
                    
                    <div className="visual-footer">
                        <p>© 2026 Career Vault Technologies. All rights reserved.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="auth-form-panel">
                    <div className="form-container-premium shadow-premium wider">
                        <div className="form-head-premium">
                            <h1>Create Your Account</h1>
                            <p>Enter your details below to get started.</p>
                        </div>

                        <div className="role-selector-premium">
                            <button 
                                className={`role-option ${formData.role === 'APPLIER' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, role: 'APPLIER'})}
                            >
                                <User size={20} />
                                <span>Job Seeker</span>
                                <small>I want to find a job</small>
                            </button>
                            <button 
                                className={`role-option ${formData.role === 'HR' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, role: 'HR'})}
                            >
                                <Briefcase size={20} />
                                <span>Recruiter</span>
                                <small>I want to hire talent</small>
                            </button>
                        </div>

                        <div className="step-stepper-premium">
                            <div className={`step-node ${step >= 1 ? 'active' : ''}`}>
                                <div className="step-idx">01</div>
                                <span>Basic Details</span>
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
                                <div className="step-idx">02</div>
                                <span>Email Verification</span>
                            </div>
                        </div>


                        {error && (
                            <div className="error-node animate-shake">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleInitialSubmit} className="premium-auth-flow">
                                <div className="form-grid-registry">
                                    <div className="float-input-group">
                                        <label>Full Name</label>
                                        <div className="input-wrapper-premium">
                                            <User size={18} className="input-icon-premium" />
                                            <input 
                                                type="text" 
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="float-input-group">
                                        <label>Email Address</label>
                                        <div className="input-wrapper-premium">
                                            <Mail size={18} className="input-icon-premium" />
                                            <input 
                                                type="email" 
                                                placeholder="name@email.com"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="float-input-group">
                                        <label>Phone Number</label>
                                        <div className="input-wrapper-premium">
                                            <Phone size={18} className="input-icon-premium" />
                                            <input 
                                                type="tel" 
                                                placeholder="Mobile Number"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {formData.role === 'HR' ? (
                                        <div className="float-input-group">
                                            <label>Company Name</label>
                                            <div className="input-wrapper-premium">
                                                <Briefcase size={18} className="input-icon-premium" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter company name"
                                                    value={formData.company}
                                                    onChange={e => setFormData({...formData, company: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="float-input-group">
                                            <label>Highest Qualification</label>
                                            <div className="input-wrapper-premium">
                                                <select 
                                                    value={formData.education}
                                                    onChange={e => setFormData({...formData, education: e.target.value})}
                                                    className="select-registry-premium"
                                                >
                                                    <option>High School</option>
                                                    <option>Diploma</option>
                                                    <option>Bachelors</option>
                                                    <option>Masters / Higher</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="float-input-group">
                                        <label>Password</label>
                                        <div className="input-wrapper-premium">
                                            <Lock size={18} className="input-icon-premium" />
                                            <input 
                                                type="password" 
                                                placeholder="Minimum 6 chars"
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="float-input-group">
                                        <label>Confirm Password</label>
                                        <div className="input-wrapper-premium">
                                            <Lock size={18} className="input-icon-premium" />
                                            <input 
                                                type="password" 
                                                placeholder="Re-enter password"
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="auth-persistence">
                                    <label className="custom-checkbox-premium">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.agreeToTerms}
                                            onChange={e => setFormData({...formData, agreeToTerms: e.target.checked})}
                                        />
                                        <span className="checkmark"></span>
                                        <span>I agree to the Terms and Conditions</span>
                                    </label>
                                </div>

                                <button type="submit" className="btn-auth-master" disabled={loading}>
                                    {loading ? <Loader className="spin" size={20} /> : <>Register Now <ArrowRight size={20} /></>}
                                </button>

                            </form>
                        ) : (
                            <div className="verification-view-premium animate-fade-in">
                                <div className="verification-hero-premium">
                                    <Mail size={48} strokeWidth={1.5} />
                                    <h3>Verify Your Email</h3>
                                    <p>We've sent a 6-digit verification code to your email address.</p>
                                    <div className="otp-hint-premium">OTP for testing: <strong>123456</strong></div>
                                </div>

                                <form onSubmit={handleOtpSubmit} className="premium-auth-flow">
                                    <div className="otp-master-container">
                                        <input 
                                            type="text" 
                                            maxLength="6"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            className="otp-entry-premium"
                                            autoFocus
                                        />
                                    </div>
                                    <button type="submit" className="btn-auth-master" disabled={loading}>
                                        {loading ? <Loader className="spin" size={20} /> : <>Verify & Finish <CheckCircle size={20} /></>}
                                    </button>
                                    <button type="button" className="btn-secondary-plain" onClick={() => setStep(1)}>
                                        Change Registration Details
                                    </button>
                                </form>
                            </div>

                        )}

                        <div className="auth-onboarding-link">
                            <p>Already registered? <Link to="/login">Access existing workspace</Link></p>
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

                .auth-form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 4rem; background: white; border-left: 1px solid var(--border); overflow-y: auto; }
                
                .form-container-premium { width: 100%; max-width: 520px; }
                .form-container-premium.wider { max-width: 640px; }
                .form-head-premium h1 { font-size: 2.5rem; font-weight: 950; letter-spacing: -1.5px; margin-bottom: 0.5rem; color: var(--text-main); }
                .form-head-premium p { color: var(--text-muted); font-weight: 600; font-size: 1.05rem; margin-bottom: 2rem; }
                
                .role-selector-premium { display: flex; gap: 1.5rem; margin-bottom: 3rem; }
                .role-option { flex: 1; padding: 1.5rem; border: 2px solid var(--border); border-radius: 20px; background: white; text-align: left; transition: var(--transition); cursor: pointer; display: flex; flex-direction: column; gap: 0.25rem; }
                .role-option.active { border-color: var(--primary); background: var(--primary-light); }
                .role-option span { font-weight: 900; font-size: 1.1rem; color: var(--text-main); }
                .role-option small { font-weight: 600; color: var(--text-muted); }
                .role-option.active span { color: var(--primary); }

                .step-stepper-premium { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
                .step-node { display: flex; align-items: center; gap: 1rem; color: var(--text-light); }
                .step-node.active { color: var(--primary); }
                .step-idx { width: 32px; height: 32px; background: var(--bg-main); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; }
                .step-node.active .step-idx { background: var(--primary); color: white; }
                .step-node span { font-size: 0.9rem; font-weight: 800; }
                .step-connector { height: 2px; width: 40px; background: var(--border); flex-shrink: 0; }
                
                .error-node { background: #fee2e2; color: #dc2626; padding: 1rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 800; border: 1px solid #fecaca; }
                
                .form-grid-registry { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .premium-auth-flow { display: flex; flex-direction: column; gap: 1.5rem; }
                .float-input-group label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
                
                .input-wrapper-premium { position: relative; }
                .input-icon-premium { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-light); transition: var(--transition); }
                .input-wrapper-premium input, .select-registry-premium { width: 100%; padding: 1rem 1rem 1rem 3.5rem; background: var(--bg-main); border: 2px solid var(--border); border-radius: 18px; font-size: 1rem; font-weight: 700; color: var(--text-main); transition: var(--transition); }
                .select-registry-premium { padding-left: 1.25rem; appearance: none; cursor: pointer; }
                .input-wrapper-premium input:focus { background: white; border-color: var(--primary); outline: none; box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.1); }
                
                .btn-auth-master { background: var(--bg-dark); color: white; padding: 1.25rem; border-radius: 18px; font-size: 1.15rem; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; transition: var(--transition); margin-top: 1rem; border: none; width: 100%; }
                .btn-auth-master:hover { background: #000; transform: translateY(-3px); box-shadow: 0 12px 24px -6px rgba(0,0,0,0.25); }
                .btn-auth-master:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
                
                .verification-hero-premium { text-align: center; margin-bottom: 2.5rem; color: var(--primary); }
                .verification-hero-premium h3 { font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 1rem 0 0.5rem; }
                .verification-hero-premium p { color: var(--text-muted); font-weight: 600; line-height: 1.6; }
                .otp-hint-premium { display: inline-block; margin-top: 1.5rem; padding: 0.5rem 1.5rem; background: var(--bg-main); border-radius: 50px; font-size: 0.85rem; font-weight: 800; color: var(--text-light); }
                .otp-hint-premium strong { color: var(--primary); }
                
                .otp-master-container { display: flex; justify-content: center; }
                .otp-entry-premium { width: 320px; padding: 1rem; font-size: 2.5rem; font-weight: 950; text-align: center; letter-spacing: 0.5rem; background: var(--bg-main); border: 2px solid var(--border); border-radius: 20px; color: var(--primary); }

                .otp-entry-premium:focus { border-color: var(--primary); background: white; box-shadow: 0 15px 30px -10px var(--primary-light); outline: none; }
                
                .btn-secondary-plain { background: none; border: none; font-weight: 800; font-size: 0.9rem; color: var(--text-muted); cursor: pointer; margin-top: 1rem; }

                .auth-onboarding-link { margin-top: 2rem; text-align: center; }
                .auth-onboarding-link p { font-size: 1rem; font-weight: 600; color: var(--text-muted); }
                .auth-onboarding-link a { color: var(--primary); font-weight: 900; }

                @media (max-width: 1200px) {
                    .auth-visual-panel { display: none; }
                    .form-container-premium { background: white; padding: 2.5rem; border-radius: 32px; border: 1px solid var(--border); }
                }
                @media (max-width: 768px) {
                    .form-grid-registry { grid-template-columns: 1fr; }
                    .auth-form-panel { padding: 1rem; }
                    .form-container-premium { padding: 2rem; max-width: 100%; border-radius: 0; border: none; }
                }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default Register;

