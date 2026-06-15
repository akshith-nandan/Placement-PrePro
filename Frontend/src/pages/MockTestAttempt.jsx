import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const MockTestAttempt = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await api.get(`/mocktests/${id}/start`);
        setTest(data);
        setTimeLeft(data.durationMinutes * 60);
        setStartTime(Date.now());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (submitting || result || !test) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: test.aptitudeQuestions.map((q) => ({
          questionId: q._id,
          selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1
        })),
        timeTakenSeconds: Math.round((Date.now() - startTime) / 1000)
      };
      const { data } = await api.post(`/mocktests/${id}/submit`, payload);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [answers, test, id, startTime, submitting, result]);

  // Countdown / auto-submit
  useEffect(() => {
    if (loading || result) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, result, handleSubmit]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const selectOption = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  if (loading) return <p className="text-slate-400">Loading test...</p>;
  if (!test) return <p className="text-slate-400">Test not found.</p>;

  // Result view
  if (result) {
    return (
      <div className="max-w-2xl">
        <div className="card text-center mb-6">
          <h1 className="text-xl font-bold mb-2">Mock Test Submitted!</h1>
          <p className="text-5xl font-bold text-primary mb-1">{result.score}/{result.totalMarks}</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div><p className="text-emerald-600 font-bold text-lg">{result.correctCount}</p><p className="text-slate-400">Correct</p></div>
            <div><p className="text-red-500 font-bold text-lg">{result.incorrectCount}</p><p className="text-slate-400">Incorrect</p></div>
            <div><p className="text-slate-500 font-bold text-lg">{result.skippedCount}</p><p className="text-slate-400">Skipped</p></div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/mocktests/${id}`} replace className="hidden" />
          <Link to="/mocktests" className="btn-primary">Back to Mock Tests</Link>
        </div>
      </div>
    );
  }

  const questions = test.aptitudeQuestions || [];
  if (questions.length === 0) {
    return <div className="card text-center text-slate-400">This mock test has no aptitude questions configured.</div>;
  }

  const q = questions[current];

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold">{test.title}</h1>
          <p className="text-sm text-slate-500">Question {current + 1} of {questions.length}</p>
        </div>
        <div className={`text-lg font-bold px-3 py-1 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-danger' : 'bg-indigo-50 text-primary'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {test.codingProblems?.length > 0 && (
        <div className="card mb-4 bg-amber-50 border-amber-100">
          <p className="text-sm font-medium text-amber-700 mb-1">📌 This test also includes {test.codingProblems.length} coding problem(s):</p>
          <div className="flex flex-wrap gap-2">
            {test.codingProblems.map((p) => (
              <Link key={p._id} to={`/coding/${p.slug}`} target="_blank" className="badge bg-white text-amber-700 border border-amber-200">
                {p.title} ↗
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-4">
        <p className="font-medium mb-4">{q.questionText}</p>
        <div className="grid gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectOption(q._id, i)}
              className={`text-left border rounded-lg px-3 py-2 text-sm transition ${
                answers[q._id] === i ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {questions.map((qq, idx) => (
          <button
            key={qq._id}
            onClick={() => setCurrent(idx)}
            className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center ${
              idx === current ? 'bg-primary text-white' : answers[qq._id] !== undefined ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
          className="btn-secondary bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50"
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary">Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MockTestAttempt;