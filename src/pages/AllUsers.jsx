import React, { useState, useEffect } from 'react';
import { adminApi } from '../db/api';
import { 
    Users, Search, Edit3, Trash2, Shield, 
    Mail, Calendar, MoreVertical, Filter, Loader2,
    Database, Activity, Globe, ShieldCheck, Zap
} from 'lucide-react';

export const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error("Load users error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you absolutely sure? This will delete all user data permanently.')) return;
        try {
            await adminApi.deleteUser(id);
            loadUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await adminApi.updateUser(id, { role: newRole });
            setEditingUser(null);
            loadUsers();
        } catch (err) {
            alert('Failed to update role');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="registry-loading-premium">
            <div className="pulse-loader"></div>
            <p>Accessing Global Identity Registry...</p>
        </div>
    );

    return (
        <div className="users-page animate-fade-in">
            <header className="page-header-premium">
                <div className="header-meta">
                    <span className="protocol-label">Governance Protocol 04</span>
                    <h1>Identity Registry</h1>
                    <p>Strategic management of all platform entities and their entitlement matrices.</p>
                </div>
                <div className="header-actions-premium">
                    <div className="search-registry-premium">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Find character instance..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-sync-premium" onClick={loadUsers}>
                        <Activity size={18} /> Sync Registry
                    </button>
                </div>
            </header>

            <div className="registry-stats-mini">
                <div className="mini-stat">
                    <Users size={16} /> <span>{users.length} Total Identities</span>
                </div>
                <div className="mini-stat">
                    <ShieldCheck size={16} /> <span>{users.filter(u => u.role === 'ADMIN').length} Overseers</span>
                </div>
                <div className="mini-stat">
                    <Zap size={16} /> <span>{users.filter(u => u.role === 'HR').length} Strategic Partners</span>
                </div>
            </div>

            <div className="registry-container-premium shadow-premium animate-slide-up">
                <div className="registry-table-scroll">
                    <table className="registry-main-table">
                        <thead>
                            <tr>
                                <th>Identity Instance</th>
                                <th>Operational Email</th>
                                <th>Entitlement Level</th>
                                <th>Ingestion Date</th>
                                <th className="text-right">Overrides</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id || u._id}>
                                    <td>
                                        <div className="ident-cell-premium">
                                            <div className="ident-avatar-premium">{u.name?.charAt(0) || 'U'}</div>
                                            <div className="ident-info">
                                                <strong className="ident-name">{u.name || 'Anonymous Node'}</strong>
                                                <span className="ident-id">#{ (u.id || u._id || '').slice(-8).toUpperCase() }</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="registry-email">{u.email}</span></td>
                                    <td>
                                        {editingUser === (u.id || u._id) ? (
                                            <select 
                                                className="registry-role-select"
                                                defaultValue={u.role} 
                                                onChange={e => handleRoleChange(u.id || u._id, e.target.value)}
                                                onBlur={() => setEditingUser(null)}
                                                autoFocus
                                            >
                                                <option value="APPLIER">APPLIER Protocol</option>
                                                <option value="HR">HR Strategic</option>
                                                <option value="ADMIN">ADMIN Overseer</option>
                                            </select>
                                        ) : (
                                            <span className={`registry-role-badge ${u.role}`}>
                                                <Shield size={12} /> {u.role}
                                            </span>
                                        )}
                                    </td>
                                    <td><span className="registry-date">{new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                                    <td>
                                        <div className="registry-actions">
                                            <button className="reg-icon-btn edit" onClick={() => setEditingUser(u.id || u._id)}><Edit3 size={16} /></button>
                                            <button className="reg-icon-btn delete" onClick={() => handleDelete(u.id || u._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .users-page { display: flex; flex-direction: column; gap: 3rem; }
                .protocol-label { font-size: 0.7rem; font-weight: 850; color: var(--primary); text-transform: uppercase; letter-spacing: 0.15em; }
                .header-meta h1 { font-size: 3rem; font-weight: 950; letter-spacing: -2px; margin: 0.5rem 0; }
                .header-meta p { color: var(--text-muted); font-size: 1.1rem; font-weight: 600; max-width: 600px; }
                
                .header-actions-premium { display: flex; gap: 1rem; align-items: flex-end; }
                .search-registry-premium { background: white; border: 1px solid var(--border); padding: 0.8rem 1.5rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 1rem; min-width: 350px; transition: var(--transition); }
                .search-registry-premium:focus-within { border-color: var(--primary); box-shadow: var(--shadow-md); }
                .search-registry-premium input { border: none; background: none; font-size: 0.95rem; font-weight: 650; outline: none; width: 100%; }
                
                .btn-sync-premium { background: var(--bg-dark); color: white; padding: 0.8rem 1.75rem; border-radius: var(--radius-full); font-weight: 800; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
                .btn-sync-premium:hover { background: black; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

                .registry-stats-mini { display: flex; gap: 2.5rem; }
                .mini-stat { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 800; }
                .mini-stat span { opacity: 0.8; }
                
                .registry-container-premium { background: white; border-radius: var(--radius-2xl); border: 1px solid var(--border); overflow: hidden; }
                .registry-main-table { width: 100%; border-collapse: collapse; text-align: left; }
                .registry-main-table th { padding: 1.5rem 2.5rem; background: var(--bg-main); border-bottom: 1px solid var(--border); font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-light); letter-spacing: 0.05em; }
                .registry-main-table td { padding: 1.75rem 2.5rem; border-bottom: 1px solid var(--border); vertical-align: middle; transition: var(--transition); }
                .registry-main-table tr:last-child td { border-bottom: none; }
                .registry-main-table tr:hover td { background: var(--bg-main); }
                
                .ident-cell-premium { display: flex; align-items: center; gap: 1.25rem; }
                .ident-avatar-premium { width: 44px; height: 44px; background: var(--primary-light); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem; }
                .ident-info { display: flex; flex-direction: column; }
                .ident-name { font-weight: 850; color: var(--text-main); font-size: 1.05rem; }
                .ident-id { font-size: 0.75rem; font-weight: 850; color: var(--text-light); font-family: monospace; }
                
                .registry-email { font-size: 0.95rem; font-weight: 600; color: var(--text-muted); }
                .registry-date { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); }
                
                .registry-role-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; border: 1px solid transparent; }
                .registry-role-badge.ADMIN { background: #fff7ed; color: #c2410c; border-color: #fed7aa; }
                .registry-role-badge.HR { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
                .registry-role-badge.APPLIER { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
                
                .registry-role-select { padding: 0.6rem 1rem; border-radius: 12px; font-size: 0.85rem; font-weight: 800; border: 2px solid var(--primary); background: white; outline: none; }
                
                .registry-actions { display: flex; gap: 1rem; justify-content: flex-end; }
                .reg-icon-btn { width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
                .reg-icon-btn:hover { background: #fef2f2; color: var(--danger); border-color: #fecaca; }
                .reg-icon-btn.edit:hover { background: #eff6ff; color: var(--primary); border-color: #bfdbfe; }

                .registry-loading-premium { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; color: var(--text-muted); font-weight: 800; }
            `}</style>
        </div>
    );
};
