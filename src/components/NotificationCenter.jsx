import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useAuth } from '../hooks/useAuth';
import { Bell, X, Check, Info, AlertTriangle } from 'lucide-react';

export const NotificationCenter = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const userId = user?._id || user?.id;

    useEffect(() => {
        if (userId) loadNotifications();

        // Polyfill initial notifications if none exist
        const seedNotifs = async () => {
            if (!userId) return;
            const count = await db.notifications.where({ userId }).count();
            if (count === 0) {
                await db.notifications.add({
                    userId,
                    title: 'Welcome to Career Vault!',
                    message: 'Complete your profile to unlock AI matching.',
                    type: 'info',
                    read: false,
                    createdAt: new Date().toISOString()
                });
                loadNotifications();
            }
        };
        seedNotifs();
    }, [userId]);

    const loadNotifications = async () => {
        if (!userId) return;
        const data = await db.notifications
            .where({ userId })
            .reverse()
            .toArray();
        setNotifications(data);
    };

    const markAsRead = async (id) => {
        await db.notifications.update(id, { read: true });
        loadNotifications();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notification-wrapper">
            <button className="nav-icon-btn" onClick={() => setIsOpen(!isOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown glass animate-slide-up">
                    <div className="dropdown-header">
                        <h3>Notifications</h3>
                        <button onClick={() => setIsOpen(false)}><X size={16} /></button>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p className="empty-msg">No new notifications</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`} onClick={() => markAsRead(n.id)}>
                                    <div className={`icon-box ${n.type}`}>
                                        {n.type === 'success' ? <Check size={14} /> : n.type === 'warning' ? <AlertTriangle size={14} /> : <Info size={14} />}
                                    </div>
                                    <div className="notif-content">
                                        <h4>{n.title}</h4>
                                        <p>{n.message}</p>
                                        <span className="time">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {!n.read && <div className="dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
        .notification-wrapper { position: relative; }
        .nav-icon-btn { position: relative; background: none; border: none; cursor: pointer; color: var(--text-main); }
        .unread-badge { position: absolute; top: -5px; right: -5px; background: var(--danger); color: white; font-size: 0.6rem; font-weight: 800; padding: 2px 5px; border-radius: 10px; border: 2px solid white; }
        .notification-dropdown { position: absolute; top: 45px; right: 0; width: 320px; max-height: 480px; background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); z-index: 1000; overflow: hidden; display: flex; flex-direction: column; }
        .dropdown-header { padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-main); }
        .notification-list { overflow-y: auto; flex: 1; }
        .notification-item { padding: 1rem; border-bottom: 1px solid var(--border); display: flex; gap: 0.75rem; cursor: pointer; transition: background 0.2s; position: relative; }
        .notification-item:hover { background: var(--bg-main); }
        .notification-item.unread { background: rgba(79, 70, 229, 0.03); }
        .icon-box { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .icon-box.info { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
        .icon-box.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .icon-box.warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .notif-content h4 { font-size: 0.85rem; margin-bottom: 0.15rem; }
        .notif-content p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.3; }
        .notif-content .time { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.4rem; display: block; }
        .notification-item.unread .dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; position: absolute; right: 1rem; top: 1.25rem; }
        .empty-msg { padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }
      `}</style>
        </div>
    );
};
