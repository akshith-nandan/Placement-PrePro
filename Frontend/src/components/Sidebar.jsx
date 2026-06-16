import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { section: 'Main' },
  { to: '/',          icon: 'fa-chart-pie',       label: 'Dashboard' },
  { to: '/aptitude',  icon: 'fa-brain',            label: 'Aptitude' },
  { to: '/coding',    icon: 'fa-code',             label: 'Coding Practice' },
  { to: '/compiler',  icon: 'fa-terminal',         label: 'Compiler' },
  { section: 'Prepare' },
  { to: '/companies', icon: 'fa-building',         label: 'Companies' },
  { to: '/mocktests', icon: 'fa-clipboard-list',   label: 'Mock Tests' },
  { to: '/materials', icon: 'fa-book-open',        label: 'Study Materials' },
  { to: '/interview', icon: 'fa-microphone-lines', label: 'Interview Prep' },
  { to: '/resume',    icon: 'fa-file-lines',       label: 'Resume Builder' },
  { section: 'Account' },
  { to: '/profile',   icon: 'fa-user',             label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🎯</div>
        <div>
          <div className="logo-text"><span>PlacementPro</span></div>
          <div className="logo-sub">Prep Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 0', flex: 1 }}>
        {nav.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section">{item.section}</div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <i className={`fas ${item.icon}`} />
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      {/* User */}
      <div className="sidebar-bottom">
        <div className="sidebar-user" onClick={() => navigate('/profile')}>
          <div className="s-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="s-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
              {user?.name || 'Student'}
            </div>
            <div className="s-role">{user?.branch || 'Student'}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }}>
          <i className="fas fa-right-from-bracket" /> Logout
        </button>
      </div>
    </aside>
  );
}