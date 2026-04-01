import React from 'react';
import { AuthProvider } from '../AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', section: 'MAIN' },
  { id: 'aptitude', label: 'Aptitude Quizzes', icon: '🧮', section: null },
  { id: 'coding', label: 'Coding Problems', icon: '⌨', section: null },
  { id: 'materials', label: 'Study Materials', icon: '📚', section: 'PREPARE' },
  { id: 'mock', label: 'Mock Tests', icon: '📝', section: null },
  { id: 'progress', label: 'My Progress', icon: '📈', section: null },
];

export default function Sidebar({ active, onNav }) {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>P</div>
        <div style={styles.logoText}>Prep<span style={{ color: 'var(--accent)' }}>Pro</span></div>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item, i) => (
          <React.Fragment key={item.id}>
            {item.section && <div style={styles.section}>{item.section}</div>}
            <button style={styles.navItem(active === item.id)} onClick={() => onNav(item.id)}>
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <div style={styles.userArea}>
        <div style={styles.avatar}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</div>
          <div style={styles.userRole}>{user?.branch || 'CSE'} · {user?.year || 'Student'}</div>
        </div>
        <button style={styles.logoutBtn} onClick={logout} title="Logout">⇥</button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: { width: '220px', flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '20px 12px', display: 'flex', flexDirection: 'column', height: '100%' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px', marginBottom: '28px' },
  logoIcon: { width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, var(--accent2), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: 'white', flexShrink: 0 },
  logoText: { fontSize: '17px', fontWeight: 800, letterSpacing: '-0.3px' },
  section: { fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1.5px', padding: '0 8px', margin: '16px 0 6px' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: active ? 'var(--accent)' : 'var(--muted)', background: active ? 'rgba(0,212,170,0.1)' : 'transparent', border: 'none', width: '100%', textAlign: 'left', transition: 'all 0.15s', marginBottom: '2px' }),
  navIcon: { fontSize: '15px', width: '20px', textAlign: 'center' },
  userArea: { marginTop: 'auto', padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent2), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0 },
  userName: { fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: '11px', color: 'var(--muted)' },
  logoutBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px', padding: '4px', transition: 'color 0.15s', flexShrink: 0 },
};