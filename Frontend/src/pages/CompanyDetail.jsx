import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const CompanyDetail = () => {
  const { name } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ role: '', rating: 5, experience: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCompany = async () => {
    try {
      const { data } = await api.get(`/companies/${name}`);
      setCompany(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await api.post(`/companies/${name}/experience`, form);
      setForm({ role: '', rating: 5, experience: '' });
      setMessage('Thanks for sharing your experience!');
      fetchCompany();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-slate-400">Loading...</p>;
  if (!company) return <p className="text-slate-400">Company not found.</p>;

  return (
    <div className="max-w-3xl">
      <Link to="/companies" className="text-sm text-primary mb-4 inline-block">← Back to companies</Link>

      <h1 className="text-2xl font-bold mb-1">{company.name}</h1>
      <p className="text-slate-500 mb-6">Cutoff: {company.cutoff || 'N/A'}</p>

      <div className="card mb-4">
        <h3 className="font-semibold mb-2">📋 Hiring Pattern</h3>
        <p className="text-sm text-slate-600">{company.hiringPattern}</p>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-2">📚 Previous Questions</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          {company.previousQuestions.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-3">💬 Interview Experiences</h3>
        {company.interviewExperiences.length === 0 ? (
          <p className="text-sm text-slate-400">No experiences shared yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {company.interviewExperiences.map((exp, idx) => (
              <div key={idx} className="border border-slate-100 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <p className="font-medium text-sm">{exp.studentName} {exp.role && `• ${exp.role}`}</p>
                  <p className="text-amber-500 text-sm">{'★'.repeat(exp.rating)}</p>
                </div>
                <p className="text-sm text-slate-600">{exp.experience}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">✍️ Share Your Interview Experience</h3>
        {message && <div className="bg-emerald-50 text-emerald-600 text-sm rounded-lg p-3 mb-3">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <textarea className="input-field" rows={4} required value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Describe your interview rounds, questions asked, tips..." />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit Experience'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyDetail;