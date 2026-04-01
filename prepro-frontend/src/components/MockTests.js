import React, { useEffect, useState, useRef } from 'react';
import { mock } from '../api';

export default function MockTests() {
  const [view, setView] = useState('list');
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [curQ, setCurQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    mock.getAll().then(r => setTests(r.data)).catch(() => {}).finally(() => setLoading(false));
    return () => clearInterval(timerRef.current);
  }, []);

  const startTest = async (id) => {
    const res = await mock.getOne(id);
    setActiveTest(res.data);
    setAnswers({});
    setCurQ(0);
    setResult(null);
    const duration = res.data.duration * 60;
    setTimeLeft(duration);
    startTimeRef.current = Date.now();
    setView('test');
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAutoSubmit(res.data, {}); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleAutoSubmit = async (test, ans) => {
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const res = await mock.submit(test.id, ans, elapsed);
      setResult(res.data);
      setView('result');
      setTests(prev => prev.map(t => t.id === test.id ? { ...t, bestScore: Math.max(t.bestScore || 0, res.data.score), attempts: (t.attempts || 0) + 1 } : t));
    } catch {}
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const res = await mock.submit(activeTest.id, answers, elapsed);
      setResult(res.data);
      setView('result');
      setTests(prev => prev.map(t => t.id === activeTest.id ? { ...t, bestScore: Math.max(t.bestScore || 0, res.data.score), attempts: (t.attempts || 0) + 1 } : t));
    } catch { alert('Submit failed'); }
    finally { setSubmitting(false); }
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerColor = timeLeft < 300 ? 'var(--danger)' : timeLeft < 600 ? 'var(--warning)' : 'var(--accent)';

  if (loading) return <div style={s.loading}>Loading tests...</div>;

  if (view === 'list') return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}>
        <div style={s.title}>Mock Tests</div>
        <div style={s.sub}>Simulate real placement exams under timed conditions</div>
      </div>

      <div style={s.statsRow}>
        {[
          { label: 'Tests Completed', val: tests.reduce((a, t) => a + (t.attempts || 0), 0), color: 'var(--accent2)' },
          { label: 'Best Score', val: `${Math.max(0, ...tests.map(t => t.bestScore || 0))}%`, color: 'var(--accent)' },
          { label: 'Avg Score', val: `${Math.round(tests.filter(t => t.bestScore).reduce((a, t, _, arr) => a + t.bestScore / arr.length, 0)) || 0}%`, color: 'var(--accent3)' },
        ].map(stat => (
          <div key={stat.label} style={s.miniStat}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '6px' }}>{stat.label.toUpperCase()}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.val}</div>
          </div>
        ))}
      </div>

      <div style={s.sectionTitle}>🏢 Company Mock Tests</div>
      {tests.map(test => (
        <div key={test.id} style={s.testCard}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
          <div style={{ fontSize: '36px', flexShrink: 0 }}>{test.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>{test.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{test.description}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {test.sections.map(sec => <span key={sec} style={s.secTag}>{sec}</span>)}
              <span style={s.secTag}>⏱ {test.duration} min</span>
              <span style={s.secTag}>📝 {test.totalQuestions} Qs</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {test.bestScore !== null ? (
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: test.bestScore >= 70 ? 'var(--success)' : test.bestScore >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{test.bestScore}%</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Best score · {test.attempts} attempt{test.attempts !== 1 ? 's' : ''}</div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px' }}>Not attempted</div>
            )}
            <button style={s.startBtn} onClick={() => startTest(test.id)}>
              {test.bestScore !== null ? 'Retake Test' : 'Start Test'} →
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (view === 'result') return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}><div style={s.title}>Test Complete</div><div style={s.sub}>{activeTest?.name}</div></div>
      <div style={s.resultCard}>
        <div style={{ fontSize: '60px', fontWeight: 800, color: result?.score >= 70 ? 'var(--success)' : result?.score >= 50 ? 'var(--warning)' : 'var(--danger)', letterSpacing: '-2px' }}>{result?.score}%</div>
        <div style={{ fontSize: '16px', color: 'var(--muted)', margin: '8px 0', fontFamily: 'var(--mono)' }}>{result?.correct} / {result?.total} correct</div>
        <div style={{ fontSize: '16px', marginTop: '8px' }}>{result?.message}</div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button style={s.startBtn} onClick={() => startTest(activeTest.id)}>Retake Test</button>
          <button style={s.backBtn} onClick={() => setView('list')}>← All Tests</button>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <div style={s.sectionTitle}>Answer Review</div>
        {activeTest?.questions?.map((q, i) => {
          const r = result?.results?.find(r => r.id === q.id);
          return (
            <div key={q.id} style={{ ...s.reviewCard, borderColor: r?.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span>{r?.correct ? '✅' : '❌'}</span>
                <div style={{ fontWeight: 600 }}>Q{i + 1} [{q.section}] — {q.q}</div>
              </div>
              {q.opts.map((opt, idx) => (
                <div key={idx} style={{ padding: '8px 12px', borderRadius: '7px', marginBottom: '6px', fontSize: '13px', background: idx === r?.correctAnswer ? 'rgba(16,185,129,0.1)' : idx === r?.userAnswer && !r?.correct ? 'rgba(239,68,68,0.08)' : 'transparent', border: '1px solid', borderColor: idx === r?.correctAnswer ? 'rgba(16,185,129,0.4)' : idx === r?.userAnswer && !r?.correct ? 'rgba(239,68,68,0.3)' : 'transparent' }}>
                  {opt} {idx === r?.correctAnswer ? <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: '8px' }}>✓</span> : idx === r?.userAnswer && !r?.correct ? <span style={{ color: 'var(--danger)', fontWeight: 700, marginLeft: '8px' }}>✗</span> : ''}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Test view
  const q = activeTest?.questions?.[curQ];
  const totalQ = activeTest?.questions?.length || 1;
  const answered = Object.keys(answers).length;

  return (
    <div style={s.page} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: 'var(--surface)', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>{activeTest?.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{answered}/{totalQ} answered</div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 700, color: timerColor }}>{fmtTime(timeLeft)}</div>
        <button style={{ ...s.startBtn, background: 'var(--danger)' }} onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Test'}</button>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={s.quizCard}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '8px' }}>Q{curQ + 1} · {q?.section?.toUpperCase()}</div>
            <div style={{ fontSize: '17px', fontWeight: 600, lineHeight: 1.6, marginBottom: '22px' }}>{q?.q}</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {q?.opts?.map((opt, idx) => (
                <button key={idx} onClick={() => setAnswers(a => ({ ...a, [q.id]: idx }))}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', border: '1px solid', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font)', textAlign: 'left', transition: 'all 0.15s', borderColor: answers[q.id] === idx ? 'var(--accent2)' : 'var(--border2)', background: answers[q.id] === idx ? 'rgba(99,102,241,0.12)' : 'transparent', color: 'var(--text)' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button style={s.navBtn} onClick={() => setCurQ(c => c - 1)} disabled={curQ === 0}>← Prev</button>
            <div style={{ flex: 1 }} />
            <button style={{ ...s.navBtn, background: 'var(--accent2)', border: 'none', color: 'white' }} onClick={() => setCurQ(c => c + 1)} disabled={curQ === totalQ - 1}>Next →</button>
          </div>
        </div>

        <div style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '12px' }}>QUESTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {activeTest?.questions?.map((_, i) => (
                <button key={i} onClick={() => setCurQ(i)}
                  style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: i === curQ ? 'var(--accent2)' : answers[activeTest.questions[i].id] !== undefined ? 'var(--success)' : 'var(--border)', background: i === curQ ? 'rgba(99,102,241,0.15)' : answers[activeTest.questions[i].id] !== undefined ? 'rgba(16,185,129,0.1)' : 'transparent', color: i === curQ ? 'var(--accent2)' : answers[activeTest.questions[i].id] !== undefined ? 'var(--success)' : 'var(--muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{i + 1}</button>
              ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16,185,129,0.2)', display: 'inline-block' }} /> Answered ({answered})</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--surface2)', display: 'inline-block' }} /> Not visited ({totalQ - answered})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '28px', maxWidth: '960px' },
  loading: { padding: '60px', textAlign: 'center', color: 'var(--muted)' },
  hdr: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginTop: '4px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' },
  miniStat: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' },
  sectionTitle: { fontSize: '15px', fontWeight: 700, marginBottom: '14px' },
  testCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px', display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '12px', cursor: 'pointer', transition: 'border-color 0.2s' },
  secTag: { fontSize: '11px', background: 'var(--surface2)', color: 'var(--muted)', padding: '3px 8px', borderRadius: '6px' },
  startBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', background: 'var(--accent2)', color: 'white', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  backBtn: { padding: '10px 18px', border: '1px solid var(--border2)', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  resultCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '40px', textAlign: 'center' },
  quizCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '26px' },
  navBtn: { padding: '10px 20px', border: '1px solid var(--border2)', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  reviewCard: { background: 'var(--surface)', border: '1px solid', borderRadius: '12px', padding: '18px', marginBottom: '12px' },
};