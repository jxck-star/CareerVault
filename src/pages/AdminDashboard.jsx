import React, { useState, useEffect } from 'react';
import { adminApi, notificationApi } from '../db/api';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';
import {
    BarChart3, Users, Briefcase, Ticket, Activity,
    ShieldCheck, AlertCircle, Search, MoreVertical, Trash2, Edit3,
    Terminal, Database, Globe, Zap, Settings, ShieldAlert
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState({ userCount: 0, jobCount: 0, appCount: 0, ticketCount: 0 });
    const [recentNotifs, setRecentNotifs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                adminApi.getUsers(),
                adminApi.getStats()
            ]);
            setAllUsers(usersRes.data);
            setStats(statsRes.data);
            setRecentNotifs([]); 
        } catch (err) {
            console.error("Admin Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const socket = io(SOCKET_URL);
        
        socket.on('user:new', (newUser) => {
            console.log('Notification: New user registered');
            setAllUsers(prev => [newUser, ...prev]);
        });


        socket.on('stats:update', () => {
            // Re-fetch stats when something changes
            adminApi.getStats().then(res => setStats(res.data));
        });

        return () => socket.disconnect();
    }, []);


    const deleteUser = async (userId) => {
        if (!confirm('Delete this user and all related data?')) return;
        try {
            await adminApi.deleteUser(userId);
            loadData();
        } catch (err) {
            console.error("Delete user error:", err);
        }
    };

    const updateRole = async (userId, newRole) => {
        try {
            await adminApi.updateUser(userId, { role: newRole });
            setEditingUser(null);
            loadData();
        } catch (err) {
            console.error("Update role error:", err);
        }
    };

    if (loading) return (
        <div className="admin-loading-premium">
            <div className="pulse-loader"></div>
            <p>Accessing Global Control Matrix...</p>
        </div>
    );

    const filteredUsers = allUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page animate-fade-in">
            <header className="admin-header-elite">
                <div className="header-branding">
                    <div className="admin-logo-node">
                        <ShieldCheck size={28} />
                    </div>
                    <div className="header-meta">
                        <span className="system-chip">Admin Control Panel</span>
                        <h1>Management Dashboard</h1>
                    </div>
                </div>
                <div className="admin-quick-actions">
                    <div className="search-box-premium">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-refresh-premium" onClick={loadData}>
                        <Activity size={18} /> Refresh Data
                    </button>
                </div>
            </header>

            <div className="metrics-grid-premium">
                <div className="metric-card-premium">
                    <div className="metric-icon-premium users"><Users size={24} /></div>
                    <div className="metric-data-premium">
                        <label>User Instances</label>
                        <div className="val-line">
                            <strong>{stats.userCount}</strong>
                            <span className="trend-badge positive">+12.5%</span>
                        </div>
                    </div>
                </div>
                <div className="metric-card-premium">
                    <div className="metric-icon-premium jobs"><Briefcase size={24} /></div>
                    <div className="metric-data-premium">
                        <label>Active Modules</label>
                        <div className="val-line">
                            <strong>{stats.jobCount}</strong>
                            <span className="trend-badge positive">+5.2%</span>
                        </div>
                    </div>
                </div>
                <div className="metric-card-premium">
                    <div className="metric-icon-premium apps"><Ticket size={24} /></div>
                    <div className="metric-data-premium">
                        <label>Data Throughput</label>
                        <div className="val-line">
                            <strong>{stats.appCount}</strong>
                            <span className="trend-badge negative">-2.1%</span>
                        </div>
                    </div>
                </div>
                <div className="metric-card-premium">
                    <div className="metric-icon-premium health"><ShieldCheck size={24} /></div>
                    <div className="metric-data-premium">
                        <label>System Integrity</label>
                        <div className="val-line">
                            <strong>100%</strong>
                            <span className="trend-badge neutral">Stable</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-layout-main">
                <div className="registry-col">
                    <section className="registry-card-premium">
                        <div className="registry-header-premium">
                            <div className="title-block">
                                <h3>User Governance Registry</h3>
                                <p>Operational oversight of all platform identities.</p>
                            </div>
                            <div className="instance-count">
                                <span>{filteredUsers.length} Nodes</span>
                            </div>
                        </div>
                        
                        <div className="registry-table-wrap">
                            <table className="registry-table-premium">
                                <thead>
                                    <tr>
                                        <th>Identity Instance</th>
                                        <th>Protocol Role</th>
                                        <th>Synchronization</th>
                                        <th className="text-right">Overrides</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="id-cell-premium">
                                                    <div className="id-avatar-premium">{user.name?.[0] || 'U'}</div>
                                                    <div className="id-text">
                                                        <span className="name">{user.name}</span>
                                                        <span className="email">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`role-pill-premium ${user.role}`}>
                                                    {user.role} Protocol
                                                </span>
                                            </td>
                                            <td>
                                                <div className="sync-status active">
                                                    <div className="dot-pulse"></div>
                                                    <span>Verified</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="override-actions">
                                                    <button className="ov-btn delete" onClick={() => deleteUser(user._id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button className="ov-btn edit">
                                                        <Edit3 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="empty-registry-state">No matching instances found in registry.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <aside className="intel-col">
                    <section className="intel-card-premium">
                        <div className="intel-header">
                            <Activity size={18} />
                            <h3>Network Traffic</h3>
                        </div>
                        <div className="traffic-viz">
                            <div className="viz-bars">
                                {[40, 65, 30, 85, 55, 75, 50].map((h, i) => (
                                    <div key={i} className="viz-bar-wrapper">
                                        <div className="viz-bar" style={{ height: `${h}%` }}>
                                            <div className="viz-tooltip">{h}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="viz-labels">
                                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>
                        </div>
                    </section>

                    <section className="intel-card-premium health-monitor">
                        <div className="intel-header">
                            <ShieldAlert size={18} />
                            <h3>Subsystem Integrity</h3>
                        </div>
                        <div className="log-stream-premium">
                            <div className="log-entry success">
                                <div className="log-marker"></div>
                                <div className="log-content">
                                    <strong>Vault Backup Complete</strong>
                                    <span>Sync delta: 0.04ms</span>
                                </div>
                            </div>
                            <div className="log-entry warning">
                                <div className="log-marker"></div>
                                <div className="log-content">
                                    <strong>Node Latency Detected</strong>
                                    <span>EU-Central-1: 180ms</span>
                                </div>
                            </div>
                            <div className="log-entry info">
                                <div className="log-marker"></div>
                                <div className="log-content">
                                    <strong>API Pulse Stable</strong>
                                    <span>v3.4.0 Engine active</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>

            <style>{`
                .admin-page { display: flex; flex-direction: column; gap: 3rem; }
                .admin-header-premium { display: flex; justify-content: space-between; align-items: flex-end; }
                .matrix-status { font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.15em; }
                .admin-meta h1 { font-size: 3rem; font-weight: 900; letter-spacing: -2px; margin: 0.5rem 0; }
                .admin-meta p { color: var(--text-muted); font-size: 1.1rem; font-weight: 600; }
                
                .admin-quick-actions { display: flex; gap: 1rem; }
                .search-box-premium { background: white; border: 1px solid var(--border); padding: 0.75rem 1.5rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 1rem; width: 350px; transition: var(--transition); }
                .search-box-premium:focus-within { border-color: var(--primary); box-shadow: var(--shadow-md); }
                .search-box-premium input { border: none; outline: none; font-size: 0.95rem; font-weight: 600; width: 100%; }
                
                .btn-refresh-premium { background: var(--bg-dark); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-full); font-weight: 700; display: flex; align-items: center; gap: 0.75rem; transition: var(--transition); }
                .btn-refresh-premium:hover { background: black; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

                .metrics-grid-premium { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
                .metric-card-premium { background: white; padding: 2.5rem; border-radius: var(--radius-2xl); border: 1px solid var(--border); display: flex; gap: 1.5rem; align-items: center; }
                .metric-icon-premium { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
                .metric-icon-premium.users { background: #eff6ff; color: #3b82f6; }
                .metric-icon-premium.jobs { background: #faf5ff; color: #a855f7; }
                .metric-icon-premium.apps { background: #fdf2f8; color: #ec4899; }
                .metric-icon-premium.health { background: #f0fdf4; color: #16a34a; }
                
                .metric-data-premium label { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-light); letter-spacing: 0.05em; }
                .val-line { display: flex; align-items: baseline; gap: 1rem; margin-top: 0.25rem; }
                .val-line strong { font-size: 2rem; font-weight: 950; color: var(--text-main); letter-spacing: -1px; }
                .trend-badge { font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px; }
                .trend-badge.positive { background: #f0fdf4; color: #16a34a; }
                .trend-badge.negative { background: #fef2f2; color: #dc2626; }
                .trend-badge.neutral { background: #f8fafc; color: #64748b; }

                .admin-layout-main { display: grid; grid-template-columns: 1fr 400px; gap: 2.5rem; align-items: flex-start; }
                
                .registry-card-premium { background: white; border-radius: var(--radius-2xl); border: 1px solid var(--border); overflow: hidden; }
                .registry-header-premium { padding: 3rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
                .title-block h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.25rem; }
                .title-block p { color: var(--text-muted); font-weight: 600; font-size: 0.95rem; }
                .instance-count { background: var(--bg-dark); color: white; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800; }

                .registry-table-wrap { width: 100%; overflow-x: auto; }
                .registry-table-premium { width: 100%; border-collapse: collapse; }
                .registry-table-premium th { text-align: left; padding: 1.25rem 3rem; background: var(--bg-main); color: var(--text-light); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border); }
                .registry-table-premium td { padding: 1.5rem 3rem; border-bottom: 1px solid var(--border); transition: var(--transition); }
                .registry-table-premium tr:hover td { background: var(--bg-main); }
                
                .id-cell-premium { display: flex; align-items: center; gap: 1.25rem; }
                .id-avatar-premium { width: 44px; height: 44px; background: var(--primary-light); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
                .id-text { display: flex; flex-direction: column; }
                .id-text .name { font-weight: 800; color: var(--text-main); font-size: 1rem; }
                .id-text .email { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
                
                .role-pill-premium { font-size: 0.7rem; font-weight: 900; padding: 0.4rem 1rem; border-radius: var(--radius-full); text-transform: uppercase; border: 1px solid transparent; }
                .role-pill-premium.admin { background: #fffbeb; color: #d97706; border-color: #fef3c7; }
                .role-pill-premium.hr { background: #eef2ff; color: #4f46e5; border-color: #e0e7ff; }
                .role-pill-premium.applier { background: #f0fdf4; color: #16a34a; border-color: #dcfce7; }
                
                .sync-status { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
                .dot-pulse { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2); }
                
                .override-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
                .ov-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-light); transition: var(--transition); }
                .ov-btn:hover { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }
                .ov-btn.edit:hover { background: #eff6ff; color: #3b82f6; border-color: #93c5fd; }

                .intel-col { display: flex; flex-direction: column; gap: 2.5rem; }
                .intel-card-premium { background: white; padding: 2.5rem; border-radius: var(--radius-2xl); border: 1px solid var(--border); }
                .intel-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; color: var(--primary); }
                .intel-header h3 { font-size: 1.1rem; font-weight: 900; color: var(--text-main); }
                
                .traffic-viz { margin-top: 1rem; }
                .viz-bars { height: 180px; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
                .viz-bar-wrapper { flex: 1; height: 100%; display: flex; align-items: flex-end; position: relative; }
                .viz-bar { width: 100%; background: var(--primary); border-radius: 8px 8px 2px 2px; transition: var(--transition); cursor: pointer; opacity: 0.85; }
                .viz-bar:hover { opacity: 1; transform: scaleX(1.1); box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3); }
                .viz-tooltip { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: var(--bg-dark); color: white; padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 800; opacity: 0; pointer-events: none; transition: var(--transition); }
                .viz-bar:hover .viz-tooltip { opacity: 1; transform: translate(-50%, -5px); }
                .viz-labels { display: flex; justify-content: space-between; padding-top: 1rem; color: var(--text-light); font-size: 0.75rem; font-weight: 800; }

                .log-stream-premium { display: flex; flex-direction: column; gap: 1.5rem; }
                .log-entry { display: flex; gap: 1.25rem; padding: 1.25rem; background: var(--bg-main); border-radius: var(--radius-lg); align-items: center; }
                .log-marker { width: 12px; height: 12px; border-radius: 3px; }
                .log-entry.success .log-marker { background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); }
                .log-entry.warning .log-marker { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
                .log-entry.info .log-marker { background: #3b82f6; box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); }
                .log-content strong { display: block; font-size: 0.95rem; color: var(--text-main); font-weight: 800; }
                .log-content span { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; font-family: monospace; }

                .admin-loading-premium { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
                
                @media (max-width: 1400px) {
                    .metrics-grid-premium { grid-template-columns: repeat(2, 1fr); }
                    .admin-layout-main { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};
