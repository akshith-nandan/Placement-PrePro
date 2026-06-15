import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const AptitudeTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');
  const limit = searchParams.get('limit') || 10;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get('/aptitude/test', {
          params: { category, topic, difficulty, limit }
        });
        setQuestions(data.questions);
        setTimeLeft(data.timerMinutes * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, topic, difficulty, limit]);

  const handleSubmit = useCallback(async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const payload = {
        category,
        topic,
        answers: questions.map((q) => ({
          questionId: q._id,
          selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1
        }))
      };
      const { data } = await api.post('/aptitude/submit', payload);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions, category, topic, submitting, result]);

  // Countdown timer
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
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const selectOption = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  if (loading) return <p className="text-slate-400">Loading test...</p>;

  if (questions.length === 0) {
    return (
      <div className="card text-center text-slate-400">
        No questions found for this topic. <Link to="/aptitude" className="text-primary">Go back</Link>
      </div>
    );
  }

  // Results view
  if (result) {
    return (
      <div className="max-w-3xl">
        <div className="card text-center mb-6">
          <h1 className="text-xl font-bold mb-2">Test Completed!</h1>
          <p className="text-5xl font-bold text-primary mb-1">{result.percentage}%</p>
          <p className="text-slate-500">
            {result.score} / {result.total} correct
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const r = result.results.find((res) => res.questionId === q._id);
            return (
              <div key={q._id} className="card">
                <p className="font-medium mb-2">
                  Q{idx + 1}. {q.questionText}
                </p>
                <div className="grid gap-2 mb-2">
                  {q.options.map((opt, i) => {
                    let style = 'border-slate-200';
                    if (i === r.correctOption) style = 'border-emerald-400 bg-emerald-50';
                    else if (i === r.selectedOption && !r.isCorrect) style = 'border-red-400 bg-red-50';
                    return (
                      <div key={i} className={`border rounded-lg px-3 py-2 text-sm ${style}`}>
                        {opt}
                        {i === r.correctOption && <span className="text-emerald-600 ml-2">✓ Correct</span>}
                        {i === r.selectedOption && i !== r.correctOption && <span className="text-red-500 ml-2">✗ Your answer</span>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-2">💡 {r.explanation}</p>
              </div>
            );
          })}
        </div>

        <Link to="/aptitude" className="btn-primary inline-block mt-4">Back to Aptitude</Link>
      </div>
    );
  }

  // Test taking view
  const q = questions[current];
  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold">{category} - {topic}</h1>
          <p className="text-sm text-slate-500">Question {current + 1} of {questions.length}</p>
        </div>
        <div className={`text-lg font-bold px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-50 text-danger' : 'bg-indigo-50 text-primary'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

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

      {/* Question navigation dots */}
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
          <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AptitudeTest;