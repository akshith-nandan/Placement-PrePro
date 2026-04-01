import React, { useEffect, useState } from 'react';
import { coding } from '../api';

const DIFF_COLORS = { Easy: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' }, Medium: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' }, Hard: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' } };

export default function CodingProblems() {
  const [view, setView] = useState('list');
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('python');
  const [filter, setFilter] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const topics = ['All', 'Arrays', 'Strings', 'Dynamic Programming', 'Linked List', 'Sorting', 'Graphs'];

  useEffect(() => {
    coding.getAll().then(r => setProblems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openProblem = async (id) => {
    const res = await coding.getOne(id);
    setActiveProblem(res.data);
    setCode(res.data.starterCode?.[lang] || '// Write your solution here');
    setSubmitResult(null);
    setView('problem');
  };

  const handleLangChange = (l) => {
    setLang(l);
    if (activeProblem?.starterCode?.[l]) setCode(activeProblem.starterCode[l]);
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await coding.submit(activeProblem.id, code, lang);
      setSubmitResult(res.data);
      if (res.data.status === 'Accepted') {
        setProblems(prev => prev.map(p => p.id === activeProblem.id ? { ...p, solved: true } : p));
      }
    } catch { setSubmitResult({ status: 'Error', message: 'Submission failed.' }); }
    finally { setSubmitting(false); }
  };

  const filtered = filter === 'All' ? problems : problems.filter(p => p.topic === filter);
  const solvedCount = problems.filter(p => p.solved).length;

  if (loading) return <div style={s.loading}>Loading problems...</div>;

  if (view === 'list') return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}>
        <div>
          <div style={s.title}>Coding Problems</div>
          <div style={s.sub}>Practice DSA and crack technical interviews</div>
        </div>
        <div style={s.solvedBadge}>{solvedCount} / {problems.length} Solved</div>
      </div>

      <div style={s.filters}>
        {topics.map(t => (
          <button key={t} style={{ ...s.filterBtn, background: filter === t ? 'var(--accent2)' : 'transparent', borderColor: filter === t ? 'var(--accent2)' : 'var(--border2)', color: filter === t ? 'white' : 'var(--muted)' }} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <div style={s.tableHead}>
        <span style={{ width: '50px', color: 'var(--muted)', fontSize: '11px', fontWeight: 700 }}>#</span>
        <span style={{ flex: 1, color: 'var(--muted)', fontSize: '11px', fontWeight: 700 }}>TITLE</span>
        <span style={{ width: '130px', color: 'var(--muted)', fontSize: '11px', fontWeight: 700 }}>TOPIC</span>
        <span style={{ width: '90px', color: 'var(--muted)', fontSize: '11px', fontWeight: 700 }}>DIFFICULTY</span>
        <span style={{ width: '80px', color: 'var(--muted)', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>STATUS</span>
      </div>

      {filtered.map((p, i) => (
        <div key={p.id} style={s.row} onClick={() => openProblem(p.id)}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
          <span style={{ width: '50px', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>{String(p.id).padStart(3, '0')}</span>
          <span style={{ flex: 1, fontWeight: 600, fontSize: '14px' }}>{p.title}</span>
          <span style={{ width: '130px' }}><span style={s.topicTag}>{p.topic}</span></span>
          <span style={{ width: '90px' }}><span style={{ ...s.diffBadge, ...DIFF_COLORS[p.difficulty] }}>{p.difficulty}</span></span>
          <span style={{ width: '80px', textAlign: 'right' }}>
            {p.solved
              ? <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}>✓ Done</span>
              : <span style={{ fontSize: '13px', color: 'var(--muted)' }}>○ Todo</span>}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={s.editorLayout} className="fade-in">
      {/* Problem Panel */}
      <div style={s.problemPanel}>
        <div style={s.problemHeader}>
          <button style={s.backBtn} onClick={() => { setView('list'); setSubmitResult(null); }}>← Problems</button>
          <span style={{ ...s.diffBadge, ...DIFF_COLORS[activeProblem?.difficulty], marginLeft: 'auto' }}>{activeProblem?.difficulty}</span>
          {activeProblem?.solved && <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}>✓ Solved</span>}
        </div>
        <div style={s.problemTitle}>{activeProblem?.title}</div>
        <div style={s.problemDesc}>{activeProblem?.description}</div>

        {activeProblem?.examples?.map((ex, i) => (
          <div key={i} style={s.example}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px' }}>EXAMPLE {i + 1}</div>
            <div style={s.exCode}><span style={{ color: 'var(--muted)' }}>Input:</span> {ex.input}</div>
            <div style={s.exCode}><span style={{ color: 'var(--muted)' }}>Output:</span> {ex.output}</div>
          </div>
        ))}

        {activeProblem?.constraints?.length > 0 && (
          <div style={s.constraints}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Constraints</div>
            {activeProblem.constraints.map((c, i) => <div key={i} style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>• {c}</div>)}
          </div>
        )}

        {activeProblem?.solution && (
          <div style={s.hint}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent3)', marginBottom: '4px' }}>💡 HINT</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{activeProblem.solution}</div>
          </div>
        )}
      </div>

      {/* Code Panel */}
      <div style={s.codePanel}>
        <div style={s.editorHeader}>
          <div style={s.langTabs}>
            {['python', 'javascript'].map(l => (
              <button key={l} style={{ ...s.langTab, background: lang === l ? 'var(--surface3)' : 'transparent', color: lang === l ? 'var(--text)' : 'var(--muted)' }} onClick={() => handleLangChange(l)}>{l === 'python' ? '🐍 Python' : '🟨 JavaScript'}</button>
            ))}
          </div>
          <button style={s.submitBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? '⏳ Running...' : '▶ Submit'}
          </button>
        </div>

        <textarea style={s.codeEditor} value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />

        {submitResult && (
          <div style={{ ...s.resultBox, borderColor: submitResult.status === 'Accepted' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)', background: submitResult.status === 'Accepted' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px' }}>{submitResult.status === 'Accepted' ? '✅' : '❌'}</span>
              <span style={{ fontWeight: 700, color: submitResult.status === 'Accepted' ? 'var(--success)' : 'var(--danger)' }}>{submitResult.status}</span>
              {submitResult.runtime && <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{submitResult.runtime} · {submitResult.memory}</span>}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{submitResult.message}</div>
            {submitResult.passed !== undefined && <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Test cases: {submitResult.passed}/{submitResult.total} passed</div>}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '28px', maxWidth: '1000px' },
  loading: { padding: '60px', textAlign: 'center', color: 'var(--muted)' },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginTop: '4px' },
  solvedBadge: { background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', color: 'var(--accent)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 700 },
  filters: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  filterBtn: { padding: '7px 14px', border: '1px solid', borderRadius: '8px', background: 'transparent', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  tableHead: { display: 'flex', padding: '10px 16px', marginBottom: '4px' },
  row: { display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', marginBottom: '6px', cursor: 'pointer', transition: 'background 0.15s' },
  topicTag: { fontSize: '12px', background: 'var(--surface2)', color: 'var(--muted)', padding: '3px 8px', borderRadius: '6px' },
  diffBadge: { padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 },
  editorLayout: { display: 'flex', height: 'calc(100vh - 0px)', overflow: 'hidden' },
  problemPanel: { width: '45%', overflowY: 'auto', padding: '24px', borderRight: '1px solid var(--border)' },
  problemHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  backBtn: { padding: '8px 14px', border: '1px solid var(--border2)', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  problemTitle: { fontSize: '22px', fontWeight: 800, marginBottom: '12px' },
  problemDesc: { fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px' },
  example: { background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginBottom: '12px' },
  exCode: { fontFamily: 'var(--mono)', fontSize: '13px', marginBottom: '4px' },
  constraints: { background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' },
  hint: { background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '14px' },
  codePanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  editorHeader: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' },
  langTabs: { display: 'flex', gap: '4px' },
  langTab: { padding: '7px 14px', border: 'none', borderRadius: '7px', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  submitBtn: { marginLeft: 'auto', padding: '9px 20px', border: 'none', borderRadius: '8px', background: 'var(--accent)', color: '#000', fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  codeEditor: { flex: 1, background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '14px', padding: '20px', border: 'none', outline: 'none', resize: 'none', lineHeight: 1.7 },
  resultBox: { border: '1px solid', borderRadius: '10px', padding: '16px', margin: '12px 16px', transition: 'all 0.2s' },
};