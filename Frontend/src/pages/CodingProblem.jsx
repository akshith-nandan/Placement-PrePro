import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const difficultyBadge = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard'
};

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' }
];

const CodingProblem = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/coding/problems/${slug}`);
        setProblem(data);
        setCode(data.starterCode[language] || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblem();
  }, [slug]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (problem) setCode(problem.starterCode[lang] || '');
    setOutput('');
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    try {
      const { data } = await api.post('/coding/run', { problemSlug: slug, language, code });
      setOutput(data.output);
    } catch (err) {
      setOutput(err.response?.data?.message || 'Error running code');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      const { data } = await api.post('/coding/submit', { problemSlug: slug, language, code });
      setSubmissionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) return <p className="text-slate-400">Loading problem...</p>;

  return (
    <div>
      <Link to="/coding" className="text-sm text-primary mb-4 inline-block">← Back to problems</Link>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Problem statement */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <span className={`badge ${difficultyBadge[problem.difficulty]}`}>{problem.difficulty}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {problem.companies.map((c) => (
              <span key={c} className="badge bg-slate-100 text-slate-600">{c}</span>
            ))}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{problem.description}</p>

          <h3 className="font-semibold text-sm mb-2">Sample Test Cases</h3>
          <div className="space-y-2">
            {problem.testCases.map((tc, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-3 text-sm font-mono">
                <p><span className="text-slate-400">Input:</span> {tc.input}</p>
                <p><span className="text-slate-400">Expected:</span> {tc.expectedOutput}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div className="card flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <select className="input-field w-40" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
              {languages.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={handleRun} disabled={running} className="btn-secondary bg-slate-200 text-slate-700 hover:bg-slate-300">
                {running ? 'Running...' : '▶ Run'}
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          <textarea
            className="w-full h-72 font-mono text-sm border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />

          {output && (
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap">
              {output}
            </div>
          )}

          {submissionResult && (
            <div className={`rounded-lg p-3 text-sm font-medium ${submissionResult.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              Status: {submissionResult.status} {submissionResult.runtime && `• ${submissionResult.runtime}`}
            </div>
          )}

          <p className="text-xs text-slate-400">
            Note: Real-time code execution requires a backend integration with Judge0 or similar sandbox API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodingProblem;