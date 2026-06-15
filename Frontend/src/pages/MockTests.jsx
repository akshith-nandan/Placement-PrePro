import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const typeIcon = {
  Aptitude: '🧮',
  Coding: '💻',
  'Full Placement': '🎯'
};

const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, historyRes] = await Promise.all([
          api.get('/mocktests'),
          api.get('/mocktests/results/me')
        ]);
        setTests(testsRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-slate-400">Loading mock tests...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mock Tests</h1>
      <p className="text-slate-500 mb-6">Simulate real placement test conditions with timed mock tests.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {tests.map((t) => (
          <div key={t._id} className="card">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{typeIcon[t.type] || '📝'}</span>
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-xs text-slate-400">{t.type} • {t.durationMinutes} minutes</p>
              </div>
            </div>
            <Link to={`/mocktests/${t._id}`} className="btn-primary inline-block mt-2">Start Test</Link>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="card text-center text-slate-400 mb-8">No mock tests available. Run the seed script to populate sample data.</div>
      )}

      <h2 className="text-lg font-bold mb-3">My Test History</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2">Test</th>
              <th className="py-2">Score</th>
              <th className="py-2">Correct</th>
              <th className="py-2">Incorrect</th>
              <th className="py-2">Skipped</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h._id} className="border-b border-slate-100">
                <td className="py-2">{h.mockTest?.title}</td>
                <td className="py-2 font-semibold">{h.score}/{h.totalMarks}</td>
                <td className="py-2 text-emerald-600">{h.correctCount}</td>
                <td className="py-2 text-red-500">{h.incorrectCount}</td>
                <td className="py-2 text-slate-400">{h.skippedCount}</td>
                <td className="py-2 text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && <p className="text-center text-slate-400 py-4">No attempts yet.</p>}
      </div>
    </div>
  );
};

export default MockTests;