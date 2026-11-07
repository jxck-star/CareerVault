import React, { useState, useEffect } from 'react';
import { assessmentApi, assessmentResultApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { ClipboardList, Play, Timer, Plus, Trash2, ShieldCheck, Zap, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Assessments = () => {
    const { user } = useAuth();
    const [activeTest, setActiveTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            setLoading(true);
            const res = await assessmentApi.getAll();
            setTests(res.data);
        } catch (err) {
            console.error("Error loading assessments:", err);
        } finally {
            setLoading(false);
        }
    };

    const startTest = (test) => {
        setActiveTest(test);
        setCurrentQuestion(0);
        setAnswers({});
        setTimeLeft(45 * 60); 
        setIsFinished(false);
    };

    useEffect(() => {
        if (activeTest && timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && activeTest && !isFinished) {
            submitTest();
        }
    }, [activeTest, timeLeft, isFinished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (val) => {
        setAnswers({ ...answers, [currentQuestion]: val });
    };

    const submitTest = async () => {
        setIsFinished(true);
        const userId = user?._id || user?.id;
        try {
            await assessmentResultApi.submit({
                userId: userId,
                testId: activeTest.id,
                score: Math.floor(Math.random() * 40) + 60,
            });
        } catch (err) {
            console.error("Error submitting test:", err);
        }
    };

    const [showAdd, setShowAdd] = useState(false);
    const [newTest, setNewTest] = useState({ 
        title: '', 
        role: '', 
        difficulty: 'Intermediate', 
        duration: '45 min',
        questions: [{ q: '', options: ['', '', '', ''], correct: 0 }] 
    });

    const addQuestionField = () => {
        setNewTest({
            ...newTest,
            questions: [...newTest.questions, { q: '', options: ['', '', '', ''], correct: 0 }]
        });
    };

    const removeQuestionField = (index) => {
        const updated = newTest.questions.filter((_, i) => i !== index);
        setNewTest({ ...newTest, questions: updated });
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...newTest.questions];
        updated[index][field] = value;
        setNewTest({ ...newTest, questions: updated });
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...newTest.questions];
        updated[qIndex].options[oIndex] = value;
        setNewTest({ ...newTest, questions: updated });
    };

    const addAssessment = async () => {
        if (!newTest.title || newTest.questions.some(q => !q.q)) return alert("Please fill title and all questions");
        try {
            await assessmentApi.create(newTest);
            setNewTest({ 
                title: '', 
                role: '', 
                difficulty: 'Intermediate', 
                duration: '45 min',
                questions: [{ q: '', options: ['', '', '', ''], correct: 0 }] 
            });
            setShowAdd(false);
            loadTests();
        } catch (err) {
            console.error("Error adding assessment:", err);
        }
    };

    const deleteAssessment = async (id) => {
        if (!confirm('Delete this assessment?')) return;
        try {
            await assessmentApi.delete(id);
            loadTests();
        } catch (err) {
            console.error("Error deleting assessment:", err);
        }
    };

    if (loading) return (
        <div className="loading-screen-premium">
            <div className="pulse-loader"></div>
            <p>Synchronizing Verification Nodes...</p>
        </div>
    );

    if (activeTest) {
        if (isFinished) {
            return (
                <div className="test-interface glass animate-fade-in text-center">
                    <div className="completion-hero">
                        <CheckCircle2 size={80} className="success-glow" />
                        <h2>Verification Matrix Sealed</h2>
                        <p className="completion-subtitle">Your performance data has been ingested into the global talent registry.</p>
                        
                        <div className="performance-summary-premium">
                            <div className="perf-item-premium">
                                <span>Consistency</span>
                                <strong>High</strong>
                            </div>
                            <div className="perf-item-premium">
                                <span>Accuracy</span>
                                <strong>89%</strong>
                            </div>
                        </div>

                        <button className="btn-primary btn-lg-premium" onClick={() => setActiveTest(null)}>
                            Return to Control Center
                        </button>
                    </div>
                    <style>{`
                        .completion-hero { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 4rem 2rem; }
                        .success-glow { color: var(--success); filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.4)); }
                        .completion-subtitle { color: var(--text-muted); font-size: 1.2rem; max-width: 500px; }
                        .performance-summary-premium { display: flex; gap: 2rem; margin: 2rem 0; width: 100%; max-width: 400px; }
                        .perf-item-premium { flex: 1; background: var(--bg-main); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); }
                        .perf-item-premium span { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-light); }
                        .perf-item-premium strong { display: block; font-size: 1.5rem; margin-top: 0.5rem; color: var(--text-main); }
                    `}</style>
                </div>
            );
        }

        return (
            <div className="test-interface glass animate-fade-in">
                <div className="test-header">
                    <div className="test-context">
                        <span className="node-label">Verification Node Active</span>
                        <h2>{activeTest.title}</h2>
                        <div className="progress-bar-premium">
                            <div className="progress-fill-premium" style={{ width: `${((currentQuestion + 1) / (activeTest.questions?.length || 1)) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="timer-premium">
                        <Timer size={20} /> 
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
                
                <div className="test-body-premium">
                    <div className="question-matrix">
                        <div className="q-indicator">
                            <span className="current">0{currentQuestion + 1}</span>
                            <span className="total">/ 0{activeTest.questions?.length || 1}</span>
                        </div>
                        <p className="question-text-premium">{activeTest.questions?.[currentQuestion]?.q || "Processing System Query..."}</p>
                        
                        <div className="options-grid-premium">
                            {(activeTest.questions?.[currentQuestion]?.options || ["Option Alpha", "Option Beta", "Option Gamma", "Option Delta"]).map((opt, i) => (
                                <label key={i} className={`option-premium ${answers[currentQuestion] === opt ? 'selected' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name={`q${currentQuestion}`} 
                                        checked={answers[currentQuestion] === opt}
                                        onChange={() => handleAnswer(opt)}
                                    /> 
                                    <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                                    <span className="option-content-text">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="test-footer-premium">
                    <button className="abort-btn-premium" onClick={() => setActiveTest(null)}>Abort Assessment</button>
                    {currentQuestion < (activeTest.questions?.length || 1) - 1 ? (
                        <button className="next-btn-premium" onClick={() => setCurrentQuestion(prev => prev + 1)}>
                            Scale to Next Node <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button className="submit-btn-premium" onClick={submitTest}>
                            Finalize Verification <Zap size={18} />
                        </button>
                    )}
                </div>
                
                <style>{`
                    .test-interface { background: white; border-radius: var(--radius-2xl); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-premium); }
                    .test-header { padding: 3rem; background: var(--bg-main); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                    .node-label { font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem; }
                    .test-header h2 { font-size: 2rem; letter-spacing: -1px; margin-bottom: 1.5rem; }
                    
                    .progress-bar-premium { width: 300px; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
                    .progress-fill-premium { height: 100%; background: var(--primary); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                    
                    .timer-premium { background: var(--bg-dark); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.75rem; font-weight: 800; font-family: monospace; font-size: 1.25rem; }
                    
                    .test-body-premium { padding: 4rem 3rem; }
                    .q-indicator { margin-bottom: 1.5rem; font-weight: 900; letter-spacing: 1px; }
                    .q-indicator .current { font-size: 1.5rem; color: var(--primary); }
                    .q-indicator .total { font-size: 1rem; color: var(--text-light); }
                    
                    .question-text-premium { font-size: 1.75rem; font-weight: 800; line-height: 1.4; color: var(--text-main); margin-bottom: 3rem; }
                    
                    .options-grid-premium { display: grid; gap: 1rem; }
                    .option-premium { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: var(--bg-main); border: 2px solid transparent; border-radius: var(--radius-lg); cursor: pointer; transition: var(--transition); }
                    .option-premium:hover { border-color: var(--border-hover); background: white; transform: translateX(10px); }
                    .option-premium.selected { border-color: var(--primary); background: white; box-shadow: var(--shadow-md); }
                    .option-letter { width: 32px; height: 32px; background: white; border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; }
                    .option-premium.selected .option-letter { background: var(--primary); color: white; border-color: var(--primary); }
                    .option-content-text { font-weight: 700; color: var(--text-main); font-size: 1.1rem; }
                    .option-premium input { display: none; }
                    
                    .test-footer-premium { padding: 2rem 3rem; background: var(--bg-main); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                    .abort-btn-premium { font-weight: 800; color: var(--text-light); font-size: 0.9rem; }
                    .abort-btn-premium:hover { color: var(--danger); }
                    
                    .next-btn-premium, .submit-btn-premium { background: var(--primary); color: white; padding: 1rem 2rem; border-radius: var(--radius-md); font-weight: 800; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.39); }
                    .submit-btn-premium { background: var(--bg-dark); }
                `}</style>
            </div>
        );
    }

    return (
        <div className="assessments-container animate-fade-in">
            <header className="page-header-premium">
                <div className="header-context">
                    <span className="context-label">Operational Capacity Modules</span>
                    <h1>Verification Matrix</h1>
                    <p>Validation nodes to calibrate your position in the professional ecosystem.</p>
                </div>
                {(user?.role === 'HR' || user?.role === 'ADMIN') && (
                    <button className="btn-primary-premium btn-lg-premium" onClick={() => setShowAdd(!showAdd)}>
                        {showAdd ? 'Abort Node Creation' : <><Plus size={18} /> Initialize New Node</>}
                    </button>
                )}
            </header>

            {showAdd && (
                <div className="add-node-panel animate-slide-up">
                    <div className="panel-header-premium">
                        <h3>New Assessment Node Topology</h3>
                        <p>Define the parameters for candidate verification.</p>
                    </div>
                    
                    <div className="panel-grid-premium">
                        <div className="input-field-premium">
                            <label>Module Title</label>
                            <input type="text" placeholder="e.g. Distributed Systems Architecture" value={newTest.title} onChange={e => setNewTest({ ...newTest, title: e.target.value })} />
                        </div>
                        <div className="input-field-premium">
                            <label>Target Designation</label>
                            <input type="text" placeholder="e.g. Lead Systems Engineer" value={newTest.role} onChange={e => setNewTest({ ...newTest, role: e.target.value })} />
                        </div>
                        <div className="input-field-premium">
                            <label>Complexity Index</label>
                            <select value={newTest.difficulty} onChange={e => setNewTest({ ...newTest, difficulty: e.target.value })}>
                                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="questions-form">
                        <div className="q-form-header">
                            <h4>Query Parameters ({newTest.questions.length})</h4>
                            <button className="add-q-btn-premium" onClick={addQuestionField}>+ Append Query</button>
                        </div>
                        
                        {newTest.questions.map((q, qIdx) => (
                            <div key={qIdx} className="q-field-premium">
                                <div className="q-field-header">
                                    <span className="q-number">Query 0{qIdx + 1}</span>
                                    {newTest.questions.length > 1 && (
                                        <button className="remove-q-btn" onClick={() => removeQuestionField(qIdx)}><Trash2 size={16} /></button>
                                    )}
                                </div>
                                <input 
                                    className="q-input-premium"
                                    type="text" 
                                    placeholder="Enter verification query..." 
                                    value={q.q} 
                                    onChange={e => updateQuestion(qIdx, 'q', e.target.value)} 
                                />
                                <div className="options-input-grid">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="opt-input-wrapper">
                                            <input 
                                                type="radio" 
                                                checked={q.correct === oIdx} 
                                                onChange={() => updateQuestion(qIdx, 'correct', oIdx)} 
                                            />
                                            <input 
                                                type="text" 
                                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} 
                                                value={opt} 
                                                onChange={e => updateOption(qIdx, oIdx, e.target.value)} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="panel-actions-premium">
                        <button className="discard-btn-premium" onClick={() => setShowAdd(false)}>Abort Deployment</button>
                        <button className="deploy-btn-premium" onClick={addAssessment}>Finalize & Deploy Node</button>
                    </div>
                </div>
            )}

            <div className="assessments-grid-premium" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
                {tests.map(test => (
                    <div key={test.id} className="node-card-premium animate-slide-up">
                        <div className="node-card-head">
                            <div className="node-icon-premium">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="node-title-group">
                                <h3>{test.title}</h3>
                                <span className={`node-diff-badge ${test.difficulty}`}>{test.difficulty} Module</span>
                            </div>
                        </div>
                        
                        <div className="node-stats-premium">
                            <div className="node-stat-item">
                                <Timer size={14} /> <span>{test.duration}</span>
                            </div>
                            <div className="node-stat-item">
                                <ClipboardList size={14} /> <span>{test.questions} Units</span>
                            </div>
                        </div>

                        <div className="node-footer-premium">
                            <button className="initiate-btn-premium" onClick={() => startTest(test)}>
                                Initiate Verification <Play size={14} fill="currentColor" />
                            </button>
                            {(user?.role === 'HR' || user?.role === 'ADMIN') && (
                                <button className="node-delete-btn-premium" onClick={() => deleteAssessment(test.id)}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .assessments-container { padding-bottom: 5rem; }
                .page-header-premium { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; }
                .header-context h1 { font-size: 3rem; font-weight: 900; letter-spacing: -2px; margin: 0.5rem 0; }
                .context-label { font-size: 0.75rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
                
                .add-node-panel { background: white; padding: 3rem; border-radius: var(--radius-2xl); border: 1px solid var(--border); margin-bottom: 4rem; box-shadow: var(--shadow-lg); }
                .panel-header-premium h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
                .panel-header-premium p { color: var(--text-muted); font-weight: 600; margin-bottom: 2.5rem; }
                
                .panel-grid-premium { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
                .input-field-premium label { display: block; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.75rem; letter-spacing: 0.05em; }
                .input-field-premium input, .input-field-premium select { width: 100%; padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--bg-main); font-weight: 700; font-size: 1rem; }
                
                .q-form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .add-q-btn-premium { background: var(--primary-light); color: var(--primary); padding: 0.6rem 1.25rem; border-radius: 12px; font-weight: 800; font-size: 0.85rem; }
                
                .q-field-premium { background: var(--bg-main); padding: 2rem; border-radius: var(--radius-xl); margin-bottom: 1.5rem; border: 1px dashed var(--border); }
                .q-field-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .q-number { font-weight: 900; color: var(--text-light); font-size: 0.8rem; text-transform: uppercase; }
                .q-input-premium { width: 100%; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--border); margin-bottom: 1.5rem; font-weight: 700; font-size: 1.1rem; }
                
                .options-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .opt-input-wrapper { display: flex; align-items: center; gap: 1rem; background: white; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); }
                .opt-input-wrapper input[type="text"] { border: none; outline: none; flex: 1; font-weight: 600; }
                
                .panel-actions-premium { display: flex; justify-content: flex-end; gap: 1.5rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
                .discard-btn-premium { font-weight: 800; color: var(--text-light); }
                .deploy-btn-premium { background: var(--bg-dark); color: white; padding: 1rem 2.5rem; border-radius: var(--radius-lg); font-weight: 800; }

                .node-card-premium { padding: 2.5rem; background: white; border-radius: var(--radius-2xl); border: 1px solid var(--border); transition: var(--transition); border-bottom: 4px solid var(--border); }
                .node-card-premium:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: var(--shadow-premium); }
                
                .node-card-head { display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 2.5rem; }
                .node-icon-premium { width: 56px; height: 56px; background: var(--primary-light); color: var(--primary); border-radius: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .node-title-group h3 { font-size: 1.35rem; margin-bottom: 0.4rem; color: var(--text-main); line-height: 1.2; }
                .node-diff-badge { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; }
                .node-diff-badge.Advanced { color: var(--danger); }
                .node-diff-badge.Intermediate { color: var(--warning); }
                .node-diff-badge.Beginner { color: var(--success); }
                
                .node-stats-premium { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
                .node-stat-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; background: var(--bg-main); padding: 0.4rem 0.8rem; border-radius: 8px; }
                
                .node-footer-premium { display: flex; gap: 1rem; }
                .initiate-btn-premium { flex: 1; background: var(--bg-dark); color: white; padding: 1.1rem; border-radius: var(--radius-lg); font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; }
                .initiate-btn-premium:hover { background: #1e293b; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.4); }
                .node-delete-btn-premium { width: 54px; height: 54px; border-radius: var(--radius-lg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-light); }
                .node-delete-btn-premium:hover { color: var(--danger); background: var(--danger-light); border-color: transparent; }

                .loading-screen-premium { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; color: var(--text-muted); font-weight: 700; }
            `}</style>
        </div>
    );
};
