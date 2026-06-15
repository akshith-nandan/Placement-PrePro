import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', college: '', branch: '', year: '', placementGoal: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        year: user.year || '',
        placementGoal: user.placementGoal || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser({ ...user, ...data });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">My Profile</h1>
      <p className="text-slate-500 mb-6">Manage your personal and academic information.</p>

      <div className="card">
        {message && <div className="bg-emerald-50 text-emerald-600 text-sm rounded-lg p-3 mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input name="name" className="input-field" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input-field bg-slate-100" value={user?.email || ''} disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">College</label>
              <input name="college" className="input-field" value={form.college} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <input name="branch" className="input-field" value={form.branch} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <input name="placementGoal" className="input-field" value={form.placementGoal} onChange={handleChange} placeholder="e.g. SDE Role at FAANG" />
            </div>
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;