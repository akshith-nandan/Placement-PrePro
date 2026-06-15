import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const subjects = ['DBMS', 'OS', 'CN', 'OOPs', 'Cloud Computing'];

const subjectIcon = {
  DBMS: '🗄️',
  OS: '💾',
  CN: '🌐',
  OOPs: '📦',
  'Cloud Computing': '☁️',
  General: '💬'
};

const InterviewPrep = () => {
  const [type, setType] = useState('Technical');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = { type };
        if (subject) params.subject = subject;
        const { data } = await api.get('/interview', { params });
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [type, subject]);

  const toggleExpand = (id) => setExpanded({ ...expanded, [id]: !expanded[id] });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Interview Preparation</h1>
      <p className="text-slate-500 mb-6">Practice technical and HR interview questions with sample answers.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['Technical', 'HR'].map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setSubject(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${type === t ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {t === 'Technical' ? '💻 Technical Interview' : '🎤 HR Interview'}
          </button>
        ))}
      </div>

      {type === 'Technical' && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSubject('')}
            className={`badge ${subject === '' ? 'bg-indigo-100 text-primary' : 'bg-slate-100 text-slate-600'}`}
          >
            All Subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`badge ${subject === s ? 'bg-indigo-100 text-primary' : 'bg-slate-100 text-slate-600'}`}
            >
              {subjectIcon[s]} {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading questions...</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q._id} className="card">
              <div className="flex justify-between items-start gap-3">
                <div>
                  {type === 'Technical' && <span className="badge bg-slate-100 text-slate-600 mb-2 inline-block">{subjectIcon[q.subject]} {q.subject}</span>}
                  <p className="font-medium">{q.question}</p>
                </div>
                <button onClick={() => toggleExpand(q._id)} className="text-sm text-primary whitespace-nowrap">
                  {expanded[q._id] ? 'Hide Answer' : 'Show Sample Answer'}
                </button>
              </div>
              {expanded[q._id] && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                  💡 {q.sampleAnswer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="card text-center text-slate-400">No questions found. Run the seed script to populate sample data.</div>
      )}
    </div>
  );
};

export default InterviewPrep;