import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const difficultyBadge = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard'
};

const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];

const Coding = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ difficulty: '', topic: '', company: '' });

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.topic) params.topic = filters.topic;
        if (filters.company) params.company = filters.company;

        const { data } = await api.get('/coding/problems', { params });
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Coding Practice</h1>
      <p className="text-slate-500 mb-6">Sharpen your DSA skills with company-tagged problems.</p>

      <div className="card mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select className="input-field" value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <select className="input-field" value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })}>
            <option value="">All</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            className="input-field"
            placeholder="e.g. Amazon"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading problems...</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2">Title</th>
                <th className="py-2">Difficulty</th>
                <th className="py-2">Topic</th>
                <th className="py-2">Companies</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3">
                    <Link to={`/coding/${p.slug}`} className="text-primary font-medium hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3">
                    <span className={`badge ${difficultyBadge[p.difficulty]}`}>{p.difficulty}</span>
                  </td>
                  <td className="py-3">{p.topic}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.companies.map((c) => (
                        <span key={c} className="badge bg-slate-100 text-slate-600">{c}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {problems.length === 0 && (
            <p className="text-center text-slate-400 py-6">No problems found. Run the seed script to populate sample data.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Coding;