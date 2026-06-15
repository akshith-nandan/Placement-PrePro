import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    year: '',
    placementGoal: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-primary text-white flex-col items-center justify-center p-12">
        <span className="text-5xl mb-4">🚀</span>
        <h1 className="text-3xl font-bold mb-2">Join PlacementPro</h1>
        <p className="text-indigo-100 text-center max-w-sm">
          Track your progress across aptitude, coding, and interviews — all in one place.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-slate-500 mb-6">Start your placement preparation today.</p>

          {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input name="name" required className="input-field" value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" required className="input-field" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input name="password" type="password" required minLength={6} className="input-field" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">College</label>
                <input name="college" className="input-field" value={form.college} onChange={handleChange} placeholder="Your college" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input name="branch" className="input-field" value={form.branch} onChange={handleChange} placeholder="e.g. CSE" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select name="year" className="input-field" value={form.year} onChange={handleChange}>
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Placement Goal</label>
                <input name="placementGoal" className="input-field" value={form.placementGoal} onChange={handleChange} placeholder="e.g. SDE Role" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;