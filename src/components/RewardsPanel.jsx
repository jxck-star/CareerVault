import React from 'react';
import { Award, Zap, Shield, Star, Rocket, CheckCircle } from 'lucide-react';

export const RewardsPanel = ({ profile }) => {
    const completeness = profile ? calculateCompleteness(profile) : 0;

    function calculateCompleteness(p) {
        let filled = 0;
        if (p.personal.name && p.personal.phone) filled++;
        if (p.education.length > 0) filled++;
        if (p.experience.length > 0) filled++;
        if (p.skills.length > 2) filled++;
        if (p.projects?.length > 0) filled++;
        if (p.certifications?.length > 0) filled++;
        return Math.round((filled / 6) * 100);
    }

    const badges = [
        { id: 'ats', icon: <Star />, label: 'ATS Star', condition: profile?.personal.bio?.length > 50, color: '#f59e0b' },
        { id: 'skill', icon: <Zap />, label: 'Skill Master', condition: profile?.skills.length >= 5, color: '#6366f1' },
        { id: 'profile', icon: <Rocket />, label: 'Ready to Hire', condition: completeness === 100, color: '#10b981' },
        { id: 'vet', icon: <Shield />, label: 'Vetted Applier', condition: profile?.certifications?.length > 0, color: '#ec4899' }
    ];

    return (
        <div className="rewards-card glass animate-fade-in">
            <h3><Award size={20} color="var(--primary)" /> Professional Achievements</h3>
            <div className="badge-grid">
                {badges.map(badge => (
                    <div key={badge.id} className={`badge-item ${badge.condition ? 'unlocked' : 'locked'}`}>
                        <div className="badge-circle" style={{ background: badge.condition ? badge.color : 'var(--border)' }}>
                            {badge.icon}
                        </div>
                        <span>{badge.label}</span>
                        {badge.condition ? <CheckCircle size={12} className="check" /> : <div className="lock-icon">🔒</div>}
                    </div>
                ))}
            </div>

            <style>{`
        .rewards-card { padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); margin-top: 1.5rem; }
        .rewards-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 1.1rem; }
        .badge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; }
        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; position: relative; }
        .badge-circle { width: 50px; height: 50px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: transform 0.3s; }
        .badge-item.unlocked:hover .badge-circle { transform: scale(1.1); }
        .badge-item span { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-align: center; }
        .badge-item.unlocked span { color: var(--text-main); }
        .badge-item.locked { opacity: 0.5; grayscale: 100%; }
        .badge-item .check { position: absolute; top: 0; right: 20px; color: #10b981; background: white; border-radius: 50%; }
        .badge-item .lock-icon { font-size: 0.6rem; position: absolute; top: 0; right: 20px; }
      `}</style>
        </div>
    );
};
