import React, { useState, useEffect } from 'react';
import { ticketApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export const SupportTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ subject: '', message: '', category: 'General Help', priority: 'Medium' });
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [response, setResponse] = useState('');

    useEffect(() => {
        loadTickets();
    }, [user?.id]);

    const loadTickets = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const res = await ticketApi.getByUser(user.id);
            setTickets(res.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error("Error loading tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = user?._id || user?.id;
            await ticketApi.create({
                userId: userId,
                ...newTicket
            });
            setNewTicket({ subject: '', message: '', category: 'General Help', priority: 'Medium' });
            loadTickets();
        } catch (err) {
            console.error("Error creating ticket:", err);
            alert("Failed to send ticket");
        }
    };

    const handleAdminReply = async (ticketId) => {
        if (!response) return;
        try {
            // Since we don't have a specific reply endpoint yet, we could use update if implemented
            // or I could quickly add a reply route. For now, let's assume update works.
            const t = tickets.find(ticket => ticket.id === ticketId);
            const updatedResponses = [...(t.responses || []), {
                senderId: user.id,
                message: response
            }];
            await ticketApi.update(ticketId, { 
                responses: updatedResponses,
                status: 'Resolved' 
            });
            setResponse('');
            setReplyingTo(null);
            loadTickets();
        } catch (err) {
            console.error("Error replying to ticket:", err);
        }
    };

    return (
        <div className="tickets-page animate-fade-in">
            <div className="page-header-section">
                <div>
                    <h1>Support Dynamic</h1>
                    <p>{user.role === 'ADMIN' ? 'Strategic resolution command center' : 'Direct synchronization with Career Vault technical experts'}</p>
                </div>
                <div className="support-status">
                    <div className="status-indicator">
                        <div className="pulse-dot green"></div>
                        Systems Operational
                    </div>
                </div>
            </div>

            <div className="support-grid">
                {user.role === 'APPLIER' && (
                    <div className="ticket-form-card premium-card">
                        <div className="form-header">
                            <div className="icon-circle"><Plus size={20} /></div>
                            <h3>Initialize Support Query</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Channel</label>
                                    <select value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})}>
                                        <option>General Help</option>
                                        <option>Technical Issue</option>
                                        <option>Career Guidance</option>
                                        <option>Platform Access</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Priority</label>
                                    <select className={`priority-select ${newTicket.priority}`} value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Subject Line</label>
                                <input type="text" placeholder="Brief summary of your request" value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>In-depth Description</label>
                                <textarea rows="6" placeholder="Please provide all relevant details..." value={newTicket.message} onChange={e => setNewTicket({ ...newTicket, message: e.target.value })} required></textarea>
                            </div>
                            <button type="submit" className="btn-primary w-full"><Send size={18} /> Broadcast Ticket</button>
                        </form>
                    </div>
                )}

                <div className={`ticket-inventory ${user.role !== 'APPLIER' ? 'full-width' : ''}`}>
                    <div className="inventory-header">
                        <div className="inventory-title">
                            <Clock size={20} /> 
                            <h3>Active Ticket Registry</h3>
                        </div>
                        <span className="count-tag">{tickets.length} Registered</span>
                    </div>
                    
                    {tickets.length === 0 ? (
                        <div className="empty-registry premium-card">
                            <CheckCircle size={48} className="success-icon" />
                            <h4>Zero Active Incidents</h4>
                            <p>Your support queue is currently empty. All systems are synchronized.</p>
                        </div>
                    ) : (
                        <div className="ticket-stack">
                            {tickets.map(t => (
                                <div key={t.id || t._id} className={`support-ticket-card premium-card priority-${t.priority.toLowerCase()}`}>
                                    <div className="ticket-top">
                                        <div className="status-stack">
                                            <span className={`status-pill ${t.status.toLowerCase()}`}>{t.status}</span>
                                            <span className={`priority-pill ${t.priority.toLowerCase()}`}>{t.priority} Priority</span>
                                        </div>
                                        <span className="meta-date">{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="ticket-body">
                                        <div className="category-label">{t.category}</div>
                                        <h4 className="ticket-subject">{t.subject}</h4>
                                        <p className="ticket-message">{t.message}</p>
                                        
                                        {t.responses?.length > 0 && (
                                            <div className="expert-responses">
                                                {t.responses.map((r, idx) => (
                                                    <div key={idx} className="expert-node animate-fade-in">
                                                        <div className="expert-meta">
                                                            <div className="expert-name">
                                                                <Award size={14} />
                                                                <span>{r.adminName || 'Career Vault Expert'}</span>
                                                            </div>
                                                            <span className="reply-time">{new Date(r.date || Date.now()).toLocaleTimeString()}</span>
                                                        </div>
                                                        <p className="reply-text">{r.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {user.role === 'ADMIN' && t.status !== 'Resolved' && (
                                        <div className="resolution-area">
                                            {replyingTo === (t.id || t._id) ? (
                                                <div className="resolution-box animate-slide-up">
                                                    <textarea 
                                                        placeholder="Provide definitive resolution..." 
                                                        value={response} 
                                                        onChange={e => setResponse(e.target.value)}
                                                    />
                                                    <div className="res-actions">
                                                        <button className="btn-secondary" onClick={() => setReplyingTo(null)}>Cancel</button>
                                                        <button className="btn-primary" onClick={() => handleAdminReply(t.id || t._id)}>Resolve incident</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="btn-action-init" onClick={() => setReplyingTo(t.id || t._id)}>
                                                    <Send size={16} /> Initiative Resolution
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .tickets-page { display: flex; flex-direction: column; gap: 2.5rem; }
                .page-header-section { display: flex; justify-content: space-between; align-items: flex-start; }
                .page-header-section h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 0.5rem; }
                .page-header-section p { color: var(--text-muted); font-weight: 600; font-size: 1.1rem; }
                
                .support-status { background: white; border: 1px solid var(--border); padding: 0.5rem 1.25rem; border-radius: 50px; }
                .status-indicator { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 800; color: var(--text-main); }
                .pulse-dot { width: 10px; height: 10px; border-radius: 50%; }
                .pulse-dot.green { background: var(--success); box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2); animation: pulse-green 2s infinite; }
                @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

                .support-grid { display: grid; grid-template-columns: ${user.role === 'APPLIER' ? '420px 1fr' : '1fr'}; gap: 3rem; }
                .full-width { grid-column: 1 / -1; }

                .ticket-form-card { padding: 2.5rem; sticky: top 100px; height: fit-content; }
                .form-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
                .icon-circle { background: var(--primary-light); color: var(--primary); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .form-header h3 { font-size: 1.4rem; font-weight: 850; letter-spacing: -0.5px; }

                .premium-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
                .input-group label { display: block; font-size: 0.75rem; font-weight: 850; color: var(--text-light); text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.5px; }
                .premium-form input, .premium-form select, .premium-form textarea { width: 100%; padding: 0.85rem 1.25rem; background: #f8fafc; border: 2px solid #f1f5f9; border-radius: var(--radius-md); font-weight: 600; color: var(--text-main); transition: var(--transition); }
                .premium-form input:focus, .premium-form select:focus, .premium-form textarea:focus { background: white; border-color: var(--primary-light); outline: none; box-shadow: 0 0 0 4px var(--primary-light); }

                .inventory-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 0 0.5rem; }
                .inventory-title { display: flex; align-items: center; gap: 0.75rem; color: var(--text-main); }
                .inventory-title h3 { font-size: 1.25rem; font-weight: 850; }
                .count-tag { background: #f1f5f9; color: #64748b; padding: 0.3rem 0.8rem; border-radius: 30px; font-size: 0.75rem; font-weight: 800; border: 1px solid var(--border); }

                .ticket-stack { display: flex; flex-direction: column; gap: 1.5rem; }
                .support-ticket-card { padding: 2rem; border-left: 6px solid #e2e8f0; transition: var(--transition); }
                .support-ticket-card:hover { transform: translateX(8px); }
                .support-ticket-card.priority-urgent { border-left-color: #ef4444; }
                .support-ticket-card.priority-high { border-left-color: #f97316; }
                .support-ticket-card.priority-medium { border-left-color: #3b82f6; }
                .support-ticket-card.priority-low { border-left-color: #22c55e; }

                .ticket-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .status-stack { display: flex; gap: 0.75rem; }
                .status-pill { font-size: 0.65rem; font-weight: 850; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 4px; letter-spacing: 0.5px; }
                .status-pill.open { background: #fffbeb; color: #b45309; border: 1px solid #fef3c7; }
                .status-pill.resolved { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }
                .priority-pill { font-size: 0.65rem; font-weight: 850; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 4px; background: #f1f5f9; color: #64748b; }
                .meta-date { font-size: 0.8rem; font-weight: 700; color: var(--text-light); }

                .category-label { font-size: 0.75rem; font-weight: 850; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem; }
                .ticket-subject { font-size: 1.3rem; font-weight: 850; color: var(--text-main); margin-bottom: 0.75rem; }
                .ticket-message { color: var(--text-muted); font-size: 1rem; line-height: 1.6; font-weight: 500; }

                .expert-responses { margin-top: 2rem; padding-top: 2rem; border-top: 2px dashed #f1f5f9; display: flex; flex-direction: column; gap: 1.25rem; }
                .expert-node { padding: 1.25rem; background: #f8fafc; border-radius: var(--radius-lg); border: 1px solid var(--border); position: relative; }
                .expert-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
                .expert-name { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 850; color: var(--primary); }
                .reply-time { font-size: 0.7rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; }
                .reply-text { font-size: 0.95rem; color: var(--text-main); font-weight: 550; }

                .btn-action-init { background: white; border: 1px solid var(--primary-light); color: var(--primary); display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; transition: var(--transition); margin-top: 1.5rem; }
                .btn-action-init:hover { background: var(--primary-light); }
                
                .resolution-area { margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
                .resolution-box { display: flex; flex-direction: column; gap: 1rem; }
                .resolution-box textarea { width: 100%; padding: 1rem; border-radius: 12px; border: 2px solid var(--primary-light); min-height: 120px; font-weight: 550; }
                .res-actions { display: flex; justify-content: flex-end; gap: 1rem; }

                .empty-registry { text-align: center; padding: 5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .success-icon { color: var(--success); }

                @media (max-width: 1000px) {
                    .support-grid { grid-template-columns: 1fr; }
                    .ticket-form-card { position: static; }
                }
            `}</style>
        </div>
    );
};
