import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      {/* Left branding panel */}
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-panel-logo">🎯</div>
          <h1 className="auth-panel-title">
            <span>Placement</span><br />
            <span style={{ color: 'var(--text)' }}>Pro</span>
          </h1>
          <p className="auth-panel-desc">
            Your all-in-one platform to crack campus placements with confidence.
          </p>

          <div style={{ marginBottom: 28 }}>
            {[
              '500+ Aptitude questions with explanations',
              'LeetCode-style coding practice',
              'Company-specific preparation packs',
              'AI-powered resume builder with ATS score',
            ].map((f, i) => (
              <div key={i} className="auth-feature">
                <div className="auth-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          <div className="auth-stats">
            {[['500+','Questions'],['50+','Companies'],['10K+','Students']].map(([v,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div className="auth-stat-val">{v}</div>
                <div className="auth-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-wrap">
        <div className="auth-form">
          <h2 className="auth-form-title">Welcome back 👋</h2>
          <p className="auth-form-sub">Login to continue your prep journey.</p>

          {error && (
            <div className="auth-error">
              <i className="fas fa-circle-exclamation" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email Address</label>
              <div className="input-icon">
                <i className="fas fa-envelope" />
                <input
                  className="input" type="email" required
                  placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-icon">
                <i className="fas fa-lock" />
                <input
                  className="input" type="password" required
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn btn-primary btn-lg w-full"
              style={{ justifyContent: 'center', marginTop: 8 }}
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> Logging in...</>
                : <><i className="fas fa-right-to-bracket" /> Login</>
              }
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}