import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../api';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' },
  glow1: { position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  glow2: { position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' },
  card: { position: 'relative', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '20px', padding: '40px', width: '440px', maxWidth: '95vw' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' },
  logoIcon: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent2), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white' },
  logoText: { fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' },
  title: { fontSize: '26px', fontWeight: 800, marginBottom: '6px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginBottom: '28px' },
  tabs: { display: 'flex', background: 'var(--bg)', borderRadius: '10px', padding: '4px', marginBottom: '24px', gap: '4px' },
  tab: (active) => ({ flex: 1, padding: '9px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 600, background: active ? 'var(--surface2)' : 'transparent', color: active ? 'var(--text)' : 'var(--muted)', transition: 'all 0.2s' }),
  label: { display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '6px', color: 'var(--muted)', letterSpacing: '1px' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid var(--border2)', borderRadius: '10px', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', outline: 'none', marginBottom: '16px', transition: 'border-color 0.2s' },
  btn: { width: '100%', padding: '14px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent2), var(--accent))', color: 'white', fontFamily: 'var(--font)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', transition: 'opacity 0.2s' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: 'var(--muted)', fontSize: '13px' },
  demoBtn: { width: '100%', padding: '12px', border: '1px solid var(--border2)', borderRadius: '10px', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#ef4444' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await auth.login(form.email, form.password);
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try demo@example.com / password');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError('All fields required');
    setError(''); setLoading(true);
    try {
      const res = await auth.register(form.name, form.email, form.password, form.college);
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      const res = await auth.demo();
      login(res.data.token, res.data.user);
    } catch { setError('Demo login failed'); } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.glow1} />
      <div style={s.glow2} />
      <div style={s.grid} />
      <div style={s.card} className="fade-in">
        <div style={s.logo}>
          <div style={s.logoIcon}>P</div>
          <div style={s.logoText}>Prep<span style={{ color: 'var(--accent)' }}>Pro</span></div>
        </div>
        <div style={s.title}>{tab === 'login' ? 'Welcome back' : 'Join PrepPro'}</div>
        <div style={s.sub}>{tab === 'login' ? 'Your placement journey continues here' : 'Start your placement preparation today'}</div>

        <div style={s.tabs}>
          <button style={s.tab(tab === 'login')} onClick={() => { setTab('login'); setError(''); }}>Sign In</button>
          <button style={s.tab(tab === 'signup')} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <label style={s.label}>EMAIL ADDRESS</label>
            <input style={s.input} type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} required onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
            <label style={s.label}>PASSWORD</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In to PrepPro'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label style={s.label}>FULL NAME</label>
            <input style={s.input} type="text" placeholder="Arjun Sharma" value={form.name} onChange={set('name')} required onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
            <label style={s.label}>EMAIL</label>
            <input style={s.input} type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} required onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
            <label style={s.label}>COLLEGE</label>
            <select style={{ ...s.input, cursor: 'pointer' }} value={form.college} onChange={set('college')}>
              <option value="">Select college</option>
              {['IIT Madras', 'IIT Bombay', 'NIT Trichy', 'Anna University', 'SRM University', 'VIT Vellore', 'Amrita', 'BITS Pilani', 'Other'].map(c => <option key={c}>{c}</option>)}
            </select>
            <label style={s.label}>PASSWORD</label>
            <input style={s.input} type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
        )}

        <div style={s.divider}><div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />or<div style={{ flex: 1, height: '1px', background: 'var(--border)' }} /></div>
        <button style={s.demoBtn} onClick={handleDemo} disabled={loading}>
          <span>🚀</span> {loading ? 'Loading...' : 'Try Demo Account (Arjun Sharma)'}
        </button>
      </div>
    </div>
  );
}