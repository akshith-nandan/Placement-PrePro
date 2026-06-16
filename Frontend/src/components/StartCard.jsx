import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const titles = {
  '/': 'Dashboard', '/aptitude': 'Aptitude Prep',
  '/coding': 'Coding Practice', '/compiler': 'Online Compiler',
  '/companies': 'Company Prep', '/mocktests': 'Mock Tests',
  '/materials': 'Study Materials', '/interview': 'Interview Prep',
  '/resume': 'Resume Builder', '/profile': 'My Profile',
};

export default function Topbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const title = titles[base] || 'PlacementPro';

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="page-title">{title}</span>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <i className="fas fa-search" />
          <input placeholder="Search topics, problems..." />
        </div>

        {user?.streakCount > 0 && (
          <div className="streak-chip">
            🔥 {user.streakCount} day streak
          </div>
        )}

        <div className="topbar-btn" title="Notifications">
          <i className="fas fa-bell" />
          <span className="notif-dot" />
        </div>

        <div
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c6af7,#a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  );
}