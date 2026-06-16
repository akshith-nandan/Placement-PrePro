import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name:'',email:'',password:'',college:'',branch:'',year:'',placementGoal:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-panel-logo">🚀</div>
          <h1 className="auth-panel-title">
            <span>Join</span><br />
            <span style={{ color: 'var(--text)' }}>PlacementPro</span>
          </h1>
          <p className="auth-panel-desc">
            Track your progress, solve problems, and land your dream placement.
          </p>
          <div className="auth-stats" style={{ marginTop: 32 }}>
            {[['#1','Prep Portal'],['Free','Forever'],['AI','Powered']].map(([v,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div className="auth-stat-val">{v}</div>
                <div className="auth-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-sub">Start your placement preparation today.</p>

          {error && (
            <div className="auth-error">
              <i className="fas fa-circle-exclamation" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>
              <div className="input-icon">
                <i className="fas fa-user" />
                <input className="input" name="name" required placeholder="John Doe" value={form.name} onChange={change} />
              </div>
            </div>

            <div className="field">
              <label>Email</label>
              <div className="input-icon">
                <i className="fas fa-envelope" />
                <input className="input" name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={change} />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-icon">
                <i className="fas fa-lock" />
                <input className="input" name="password" type="password" required minLength={6} placeholder="At least 6 characters" value={form.password} onChange={change} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="field" style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>College</label>
                <input className="input" name="college" placeholder="Your college" value={form.college} onChange={change} />
              </div>
              <div>
                <label className="field" style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>Branch</label>
                <input className="input" name="branch" placeholder="e.g. CSE" value={form.branch} onChange={change} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>Year</label>
                <select className="input" name="year" value={form.year} onChange={change}>
                  <option value="">Select year</option>
                  <option>1st Year</option><option>2nd Year</option>
                  <option>3rd Year</option><option>Final Year</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>Goal</label>
                <input className="input" name="placementGoal" placeholder="e.g. SDE at FAANG" value={form.placementGoal} onChange={change} />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn btn-primary btn-lg w-full"
              style={{ justifyContent: 'center' }}
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> Creating...</>
                : <><i className="fas fa-user-plus" /> Create Account</>
              }
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}