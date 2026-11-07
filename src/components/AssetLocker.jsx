import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Shield, Plus, Trash2, ExternalLink, FileCheck, Link as LinkIcon } from 'lucide-react';

export const AssetLocker = ({ userId }) => {
    const assets = useLiveQuery(() => db.vaultAssets.where('userId').equals(userId).toArray(), [userId]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAsset, setNewAsset] = useState({ name: '', url: '', type: 'Certificate' });

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newAsset.name || !newAsset.url) return;

        await db.vaultAssets.add({
            userId,
            ...newAsset,
            date: new Date().toISOString()
        });
        setNewAsset({ name: '', url: '', type: 'Certificate' });
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        await db.vaultAssets.delete(id);
    };

    return (
        <div className="asset-locker-container glass">
            <div className="locker-header">
                <div className="header-title">
                    <Shield className="icon-gold" size={24} />
                    <h3>Digital Asset Vault</h3>
                </div>
                <button className="add-btn" onClick={() => setIsAdding(!isAdding)}>
                    <Plus size={18} /> Add Asset
                </button>
            </div>

            {isAdding && (
                <form className="asset-form animate-slide-up" onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Asset Name (e.g. AWS Certified Developer)"
                        value={newAsset.name}
                        onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Verification Link / URL"
                        value={newAsset.url}
                        onChange={e => setNewAsset({ ...newAsset, url: e.target.value })}
                        required
                    />
                    <select
                        value={newAsset.type}
                        onChange={e => setNewAsset({ ...newAsset, type: e.target.value })}
                    >
                        <option>Certificate</option>
                        <option>Portfolio Project</option>
                        <option>Recommendation</option>
                        <option>Course Completion</option>
                    </select>
                    <div className="form-actions">
                        <button type="submit" className="save-btn">Secure in Vault</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                </form>
            )}

            <div className="asset-list">
                {assets?.length === 0 && !isAdding && (
                    <div className="empty-state">
                        <FileCheck size={48} className="icon-muted" />
                        <p>Your vault is empty. Secure your career assets here.</p>
                    </div>
                )}
                {assets?.map(asset => (
                    <div key={asset.id} className="asset-card">
                        <div className="asset-info">
                            <div className="asset-icon">
                                {asset.type === 'Certificate' ? <Shield size={18} /> : <LinkIcon size={18} />}
                            </div>
                            <div className="asset-details">
                                <strong>{asset.name}</strong>
                                <span>{asset.type} • {new Date(asset.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="asset-actions">
                            <a href={asset.url} target="_blank" rel="noopener noreferrer" className="view-link">
                                <ExternalLink size={16} />
                            </a>
                            <button className="delete-btn" onClick={() => handleDelete(asset.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .asset-locker-container {
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    margin-top: 2rem;
                }
                .locker-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .icon-gold { color: #f59e0b; }
                .add-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--bg-dark);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-md);
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .asset-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(0,0,0,0.02);
                    border-radius: var(--radius-md);
                    margin-bottom: 1.5rem;
                }
                .asset-form input, .asset-form select {
                    padding: 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    background: white;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                }
                .save-btn {
                    background: var(--primary);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-md);
                    font-weight: 700;
                    flex: 1;
                }
                .cancel-btn {
                    padding: 0.75rem 1rem;
                    color: var(--text-muted);
                }
                .asset-list {
                    display: grid;
                    gap: 0.75rem;
                }
                .asset-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    transition: var(--transition);
                }
                .asset-card:hover { border-color: var(--primary); transform: translateX(5px); }
                .asset-info { display: flex; align-items: center; gap: 1rem; }
                .asset-icon {
                    width: 36px;
                    height: 36px;
                    background: rgba(79, 70, 229, 0.1);
                    color: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .asset-details { display: flex; flex-direction: column; }
                .asset-details span { font-size: 0.75rem; color: var(--text-muted); }
                .asset-actions { display: flex; gap: 0.5rem; }
                .view-link, .delete-btn {
                    padding: 0.5rem;
                    border-radius: var(--radius-sm);
                    color: var(--text-muted);
                    transition: var(--transition);
                }
                .view-link:hover { color: var(--primary); background: rgba(79,70,229,0.1); }
                .delete-btn:hover { color: var(--danger); background: hsla(0, 85%, 95%, 1); }
                .empty-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--text-muted);
                }
                .icon-muted { opacity: 0.3; margin-bottom: 1rem; }
            `}</style>
        </div>
    );
};
