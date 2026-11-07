import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, LayoutDashboard, User, Users, Briefcase, Settings, Bell, HelpCircle, Target, ClipboardList, ListChecks, MessageSquare, Menu, X } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = {
    APPLIER: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/profile', label: 'My Profile', icon: User },
      { to: '/jobs', label: 'Job Matches', icon: Briefcase },
      { to: '/roadmap', label: 'Career Mode', icon: Target },
      { to: '/my-applications', label: 'My Apps', icon: ListChecks },
      { to: '/interview-prep', label: 'Interview AI', icon: MessageSquare },
      { to: '/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/tickets', label: 'Support', icon: HelpCircle },
    ],
    HR: [
      { to: '/hr-dashboard', label: 'Recruitment', icon: LayoutDashboard },
      { to: '/appliers', label: 'Appliers', icon: Users },
      { to: '/post-job', label: 'Post Job', icon: Briefcase },
      { to: '/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/tickets', label: 'Support', icon: HelpCircle },
    ],
    ADMIN: [
      { to: '/admin-dashboard', label: 'Admin Panel', icon: Settings },
      { to: '/all-users', label: 'User Control', icon: User },
      { to: '/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/tickets', label: 'Support', icon: HelpCircle },
    ],
  };

  const isGuestPage = !user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`layout ${isGuestPage ? 'guest-layout' : ''}`}>
      {/* Sidebar - Desktop */}
      {!isGuestPage && (
        <aside className="sidebar desktop-only animate-fade-in">
          <div className="sidebar-header">
            <Link to="/" className="sidebar-brand">
              Career Vault<span>.</span>
            </Link>
          </div>

          <div className="sidebar-nav">
            <div className="nav-group">
              <span className="group-label">Main Navigation</span>
              {navLinks[user?.role]?.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className={`sidebar-item ${location.pathname === link.to ? 'active' : ''}`}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar-premium">
                {user.name?.charAt(0) || 'U'}
                <div className="status-dot online"></div>
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role-badge">{user.role}</span>
              </div>
            </div>
            <button className="sidebar-logout" onClick={handleLogout} title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>
        </aside>
      )}

      {/* Top Header - Mobile & Action Area */}
      {!isGuestPage && (
        <header className="top-header">
          <div className="header-left mobile-only">
             <Link to="/" className="sidebar-brand">Career Vault<span>.</span></Link>
          </div>
          
          <div className="header-right">
            <NotificationCenter />
            <button className="hamburger mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && user && !isGuestPage && (
        <div className="mobile-sidebar-overlay animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-sidebar" onClick={e => e.stopPropagation()}>
            <div className="sidebar-header">
              <div className="sidebar-brand">Career Vault<span>.</span></div>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="mobile-nav-links">
              {navLinks[user.role]?.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-nav-item ${location.pathname === link.to ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`main-content ${isGuestPage ? 'full-width' : ''}`}>
        <div className={isGuestPage ? "" : "page-container"}>
          {children}
        </div>
      </main>

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
        }

        .guest-layout { background: #ffffff; }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          height: 100vh;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
        }

        .sidebar-header { padding: 2rem 1.5rem; }

        .sidebar-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          text-decoration: none;
          color: var(--text-main);
          letter-spacing: -1px;
        }

        .sidebar-brand span { color: var(--primary); }

        .sidebar-nav {
          flex: 1;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .group-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          padding-left: 1rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .sidebar-item:hover {
          color: var(--primary);
          background: var(--primary-light);
        }

        .sidebar-item.active {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 700;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-sidebar);
        }

        .user-info { display: flex; align-items: center; gap: 0.75rem; }

        .user-avatar-premium {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          position: relative;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }
        .status-dot.online { background: var(--success); }

        .user-details { display: flex; flex-direction: column; }
        .user-name { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
        .user-role-badge { font-size: 0.6rem; font-weight: 700; color: var(--primary); text-transform: uppercase; }

        .sidebar-logout {
            padding: 0.5rem;
            color: var(--text-muted);
            border-radius: var(--radius-sm);
        }
        .sidebar-logout:hover {
            color: var(--danger);
            background: var(--danger-light);
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          transition: var(--transition);
          padding: 2rem;
        }

        .main-content.full-width { margin-left: 0; padding: 0; }

        .top-header {
          position: sticky;
          top: 0;
          z-index: 900;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          display: none; /* Only show on mobile or if needed */
        }

        .page-container {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        @media (max-width: 1024px) {
          .sidebar { display: none; }
          .main-content { margin-left: 0; padding: 1rem; }
          .top-header { display: flex; }
        }

        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }

        .mobile-sidebar {
          width: 280px;
          height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .mobile-nav-links {
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            color: var(--text-muted);
            font-weight: 600;
        }
        .mobile-nav-item.active {
            background: var(--primary-light);
            color: var(--primary);
        }

        .mobile-logout-btn {
          margin-top: auto;
          padding: 1rem;
          background: var(--danger-light);
          color: var(--danger);
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};
