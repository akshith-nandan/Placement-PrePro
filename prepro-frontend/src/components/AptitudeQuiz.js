import React, { useEffect, useState } from 'react';
import { quizzes } from '../api';

export default function AptitudeQuiz() {
  const [view, setView] = useState('home'); // home | quiz | result
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [curQ, setCurQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    quizzes.getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let interval;
    if (view === 'quiz') {
      setTimer(0);
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view]);

  const startQuiz = async (cat) => {
    const res = await quizzes.getQuestions(cat.id);
    setActiveCategory(cat);
    setQuestions(res.data.questions);
    setAnswers({});
    setCurQ(0);
    setRevealed(false);
    setResult(null);
    setView('quiz');
  };

  const selectAnswer = (qId, idx) => {
    if (revealed) return;
    setAnswers(a => ({ ...a, [qId]: idx }));
  };

  const checkAnswer = () => setRevealed(true);

  const next = () => {
    if (curQ < questions.length - 1) {
      setCurQ(c => c + 1);
      setRevealed(false);
    }
  };

  const prev = () => {
    if (curQ > 0) {
      setCurQ(c => c - 1);
      setRevealed(answers[questions[curQ - 1]?.id] !== undefined);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await quizzes.submit(activeCategory.id, answers);
      setResult(res.data);
      setView('result');
    } catch (e) {
      alert('Submit failed, please try again.');
    } finally { setSubmitting(false); }
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (view === 'home') return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}><div style={s.title}>Aptitude Quizzes</div><div style={s.sub}>Master quantitative, logical & verbal reasoning</div></div>
      <div style={s.grid}>
        {categories.map(cat => (
          <div key={cat.id} style={s.catCard} onClick={() => startQuiz(cat)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={s.catIcon}>{cat.icon}</div>
            <div style={s.catName}>{cat.name}</div>
            <div style={s.catDesc}>{cat.count} questions</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <span style={{ ...s.diffBadge, background: cat.difficulty === 'Hard' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: cat.difficulty === 'Hard' ? 'var(--danger)' : 'var(--accent3)' }}>{cat.difficulty}</span>
              <span style={{ fontSize: '12px', color: 'var(--accent3)' }}>⭐ {cat.rating}</span>
            </div>
            <button style={s.startBtn}>Start Quiz →</button>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'result') return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}><div style={s.title}>Quiz Complete!</div><div style={s.sub}>{activeCategory?.name}</div></div>
      <div style={s.resultCard}>
        <div style={s.scoreBig}>{result?.score}%</div>
        <div style={s.scoreLabel}>{result?.correct} / {result?.total} correct · {fmtTime(timer)}</div>
        <div style={s.scoreMsg}>{result?.score >= 80 ? '🎉 Excellent! Keep it up!' : result?.score >= 60 ? '👍 Good job! Review the explanations below.' : '📚 Review these topics and try again.'}</div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button style={s.retryBtn} onClick={() => startQuiz(activeCategory)}>Retry Quiz</button>
          <button style={s.backBtn} onClick={() => setView('home')}>← All Categories</button>
        </div>
      </div>
      <div style={{ marginTop: '24px' }}>
        <div style={s.sectionTitle}>Review Answers</div>
        {questions.map((q, i) => {
          const r = result?.results?.find(r => r.id === q.id);
          return (
            <div key={q.id} style={{ ...s.reviewCard, borderColor: r?.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px' }}>{r?.correct ? '✅' : '❌'}</span>
                <div style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.5 }}>Q{i + 1}. {q.q}</div>
              </div>
              {q.opts.map((opt, idx) => (
                <div key={idx} style={{ ...s.reviewOpt, background: idx === r?.correctAnswer ? 'rgba(16,185,129,0.12)' : idx === r?.userAnswer && !r?.correct ? 'rgba(239,68,68,0.1)' : 'transparent', borderColor: idx === r?.correctAnswer ? 'rgba(16,185,129,0.4)' : idx === r?.userAnswer && !r?.correct ? 'rgba(239,68,68,0.4)' : 'var(--border)' }}>
                  {opt}
                  {idx === r?.correctAnswer && <span style={{ marginLeft: 'auto', color: 'var(--success)', fontSize: '12px', fontWeight: 700 }}>✓ Correct</span>}
                  {idx === r?.userAnswer && !r?.correct && <span style={{ marginLeft: 'auto', color: 'var(--danger)', fontSize: '12px', fontWeight: 700 }}>✗ Your answer</span>}
                </div>
              ))}
              {q.explanation && <div style={s.explanation}>💡 {q.explanation}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  const q = questions[curQ];
  const pct = ((curQ + 1) / questions.length) * 100;
  const userAns = q ? answers[q.id] : undefined;

  return (
    <div style={s.page} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button style={s.backBtn} onClick={() => setView('home')}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{activeCategory?.name}</span>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{fmtTime(timer)}</span>
          </div>
          <div style={s.topProg}><div style={{ ...s.topFill, width: `${pct}%` }} /></div>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{curQ + 1} / {questions.length}</span>
      </div>

      <div style={s.quizCard}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '12px' }}>QUESTION {curQ + 1} OF {questions.length}</div>
        <div style={s.qText}>{q?.q}</div>
        <div style={s.opts}>
          {q?.opts?.map((opt, idx) => {
            let bg = 'transparent', bc = 'var(--border2)', color = 'var(--text)';
            if (revealed) {
              if (idx === userAns && answers[q.id] === idx) { bg = 'rgba(16,185,129,0.12)'; bc = 'var(--success)'; color = 'var(--success)'; }
              // We don't know correct answer until submit, just show selected
            } else if (userAns === idx) { bg = 'rgba(99,102,241,0.12)'; bc = 'var(--accent2)'; }
            return (
              <button key={idx} style={{ ...s.opt, background: bg, borderColor: bc, color }}
                onClick={() => selectAnswer(q.id, idx)}>
                <span style={s.optLetter}>{String.fromCharCode(65 + idx)}</span> {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
        <button style={s.navBtn} onClick={prev} disabled={curQ === 0}>← Prev</button>
        <div style={{ flex: 1 }} />
        {curQ === questions.length - 1 ? (
          <button style={s.submitBtn} onClick={submitQuiz} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Quiz ✓'}</button>
        ) : (
          <button style={s.nextBtn} onClick={next}>Next →</button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '20px' }}>
        {questions.map((q, i) => (
          <button key={i} onClick={() => { setCurQ(i); setRevealed(answers[questions[i].id] !== undefined); }}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid', borderColor: i === curQ ? 'var(--accent2)' : answers[q.id] !== undefined ? 'var(--success)' : 'var(--border)', background: i === curQ ? 'rgba(99,102,241,0.15)' : answers[q.id] !== undefined ? 'rgba(16,185,129,0.1)' : 'transparent', color: i === curQ ? 'var(--accent2)' : answers[q.id] !== undefined ? 'var(--success)' : 'var(--muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '28px', maxWidth: '860px' },
  hdr: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' },
  catCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', cursor: 'pointer', transition: 'border-color 0.2s' },
  catIcon: { fontSize: '36px', marginBottom: '12px' },
  catName: { fontSize: '16px', fontWeight: 700, marginBottom: '4px' },
  catDesc: { fontSize: '13px', color: 'var(--muted)' },
  diffBadge: { padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 },
  startBtn: { width: '100%', marginTop: '16px', padding: '10px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent2), var(--accent))', color: 'white', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  topProg: { height: '4px', background: 'var(--surface3)', borderRadius: '99px', overflow: 'hidden' },
  topFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent2), var(--accent))', borderRadius: '99px', transition: 'width 0.3s' },
  quizCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' },
  qText: { fontSize: '18px', fontWeight: 600, lineHeight: 1.6, marginBottom: '24px' },
  opts: { display: 'grid', gap: '10px' },
  opt: { display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', border: '1px solid', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.15s', fontFamily: 'var(--font)', textAlign: 'left' },
  optLetter: { width: '24px', height: '24px', borderRadius: '6px', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 },
  navBtn: { padding: '10px 20px', border: '1px solid var(--border2)', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  nextBtn: { padding: '10px 24px', border: 'none', borderRadius: '8px', background: 'var(--accent2)', color: 'white', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  submitBtn: { padding: '10px 24px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent2), var(--accent))', color: 'white', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  backBtn: { padding: '9px 16px', border: '1px solid var(--border2)', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  resultCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '40px', textAlign: 'center' },
  scoreBig: { fontSize: '64px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-2px' },
  scoreLabel: { fontSize: '16px', color: 'var(--muted)', marginTop: '8px', fontFamily: 'var(--mono)' },
  scoreMsg: { fontSize: '16px', marginTop: '12px', color: 'var(--text)' },
  retryBtn: { padding: '10px 24px', border: 'none', borderRadius: '8px', background: 'var(--accent2)', color: 'white', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '16px' },
  reviewCard: { background: 'var(--surface)', border: '1px solid', borderRadius: '12px', padding: '20px', marginBottom: '14px' },
  reviewOpt: { display: 'flex', alignItems: 'center', padding: '10px 14px', border: '1px solid', borderRadius: '8px', marginBottom: '8px', fontSize: '13px', fontWeight: 500 },
  explanation: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '10px 14px', marginTop: '10px', fontSize: '13px', color: 'var(--accent2)' },
};