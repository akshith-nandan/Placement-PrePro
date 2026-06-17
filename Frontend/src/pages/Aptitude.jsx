import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';

const cats = [
  { id:'Quantitative',     icon:'🧮', color:'rgba(124,106,247,0.12)', border:'rgba(124,106,247,0.25)', accent:'var(--primary)', topics:['Profit & Loss','Time & Work','Percentages','Speed & Distance','Algebra','Ratios'] },
  { id:'Logical Reasoning',icon:'🧠', color:'rgba(168,85,247,0.1)',   border:'rgba(168,85,247,0.25)', accent:'#a855f7',           topics:['Series Completion','Blood Relations','Coding-Decoding','Puzzles','Syllogisms'] },
  { id:'Verbal Ability',   icon:'🗣️', color:'rgba(34,197,94,0.08)',   border:'rgba(34,197,94,0.25)',  accent:'var(--green)',      topics:['Synonyms','Antonyms','Reading Comprehension','Sentence Correction','Fill Blanks'] },
  { id:'Data Interpretation',icon:'📊',color:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.25)', accent:'var(--yellow)',     topics:['Pie Charts','Bar Graphs','Tables','Line Graphs'] },
];

// Sample question pool
const SAMPLE_QUESTIONS = [
  { _id:'q1', category:'Quantitative', topic:'Profit & Loss', questionText:'A shopkeeper buys for ₹400 and sells for ₹500. Profit %?', options:['20%','25%','15%','30%'], correctOption:1, explanation:'Profit=100, Profit%=(100/400)×100=25%', difficulty:'Easy' },
  { _id:'q2', category:'Quantitative', topic:'Profit & Loss', questionText:'A man sells at 10% loss. If sold ₹54 more, gains 8%. Cost price?', options:['₹300','₹350','₹400','₹450'], correctOption:0, explanation:'18% of CP=54 → CP=₹300', difficulty:'Medium' },
  { _id:'q3', category:'Quantitative', topic:'Time & Work',   questionText:'A finishes in 10 days, B in 15 days. Together?', options:['5 days','6 days','8 days','9 days'], correctOption:1, explanation:'Combined=1/10+1/15=1/6, so 6 days', difficulty:'Easy' },
  { _id:'q4', category:'Logical Reasoning', topic:'Series Completion', questionText:'Next: 2, 6, 12, 20, 30, ?', options:['40','42','44','46'], correctOption:1, explanation:'Differences:4,6,8,10,12. Next=42', difficulty:'Easy' },
  { _id:'q5', category:'Logical Reasoning', topic:'Blood Relations', questionText:'A is B\'s sister. C is B\'s father. D is C\'s father. How is A related to D?', options:['Daughter','Granddaughter','Sister','Cannot determine'], correctOption:1, explanation:'A → daughter of C → granddaughter of D', difficulty:'Medium' },
  { _id:'q6', category:'Verbal Ability', topic:'Synonyms', questionText:"Synonym of 'Benevolent':", options:['Cruel','Kind','Greedy','Lazy'], correctOption:1, explanation:"Benevolent = kind and generous", difficulty:'Easy' },
  { _id:'q7', category:'Verbal Ability', topic:'Sentence Correction', questionText:"Correct sentence:", options:["He don't like coffee.","He doesn't likes coffee.","He doesn't like coffee.","He not like coffee."], correctOption:2, explanation:"Doesn't + base verb = correct", difficulty:'Easy' },
  { _id:'q8', category:'Data Interpretation', topic:'Pie Charts', questionText:'A sector is 25% of 800. Its value?', options:['100','150','200','250'], correctOption:2, explanation:'25% of 800=200', difficulty:'Easy' },
  { _id:'q9', category:'Quantitative', topic:'Percentages', questionText:'35% of 280?', options:['90','95','98','105'], correctOption:2, explanation:'280×0.35=98', difficulty:'Easy' },
  { _id:'q10', category:'Logical Reasoning', topic:'Coding-Decoding', questionText:'If CAT=24, DOG=26 then BIG=?', options:['18','20','22','24'], correctOption:0, explanation:'B(2)+I(9)+G(7)=18', difficulty:'Medium' },
];

export default function Aptitude() {
  const [view, setView] = useState('home'); // home | test | result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [testMeta, setTestMeta] = useState({});
  const [difficulty, setDifficulty] = useState('Easy');
  const [count, setCount] = useState(10);

  const startTest = (category, topic) => {
    let pool = SAMPLE_QUESTIONS.filter(q => q.category === category);
    if (pool.length === 0) pool = SAMPLE_QUESTIONS;
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
    setQuestions(pool); setAnswers({}); setCurrent(0);
    setTimeLeft(pool.length * 60); setTestMeta({ category, topic });
    setView('test');
  };

  const submitTest = useCallback(() => {
    let correct = 0, wrong = 0, skip = 0;
    questions.forEach((q, i) => {
      if (answers[i] === undefined) skip++;
      else if (answers[i] === q.correctOption) correct++;
      else wrong++;
    });
    setResult({ correct, wrong, skip, total: questions.length, pct: Math.round((correct / questions.length) * 100) });
    setView('result');
  }, [questions, answers]);

  useEffect(() => {
    if (view !== 'test') return;
    if (timeLeft <= 0) { submitTest(); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, view, submitTest]);

  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (view === 'test') {
    const q = questions[current];
    return (
      <div>
        {/* Test header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'14px 20px' }}>
          <div>
            <div style={{ fontWeight:700, color:'var(--text)' }}>{testMeta.category} — {testMeta.topic}</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>Question {current+1} of {questions.length}</div>
          </div>
          <div className={`timer ${timeLeft < 60 ? 'danger' : ''}`}>{fmt(timeLeft)}</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 160px', gap:16 }}>
          <div>
            <div className="card mb-16">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <span style={{ fontSize:13, color:'var(--text3)', fontWeight:500 }}>Q{current+1}</span>
                <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
              </div>
              <p style={{ fontSize:15, fontWeight:500, color:'var(--text)', lineHeight:1.7, marginBottom:22 }}>{q.questionText}</p>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`opt-btn ${answers[current] === i ? 'selected' : ''}`}
                  onClick={() => setAnswers({ ...answers, [current]: i })}
                >
                  <span className="opt-label">{['A','B','C','D'][i]}</span>
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <button className="btn btn-ghost" disabled={current===0} onClick={() => setCurrent(c => c-1)}>
                <i className="fas fa-chevron-left" /> Previous
              </button>
              {current < questions.length - 1
                ? <button className="btn btn-primary" onClick={() => setCurrent(c => c+1)}>Next <i className="fas fa-chevron-right" /></button>
                : <button className="btn btn-green" onClick={submitTest}><i className="fas fa-paper-plane" /> Submit</button>
              }
            </div>
          </div>

          <div className="card card-p16" style={{ alignSelf:'start' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Questions</div>
            <div className="q-nav">
              {questions.map((_,i) => (
                <button
                  key={i}
                  className={`q-nav-btn ${i===current?'current':answers[i]!==undefined?'answered':'unanswered'}`}
                  onClick={() => setCurrent(i)}
                >{i+1}</button>
              ))}
            </div>
            <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:5, fontSize:11, color:'var(--text3)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:'var(--primary)' }} /> Current
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:'rgba(34,197,94,0.2)' }} /> Answered
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:'var(--bg4)' }} /> Skipped
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div style={{ maxWidth: 700 }}>
        <div className="card" style={{ textAlign:'center', padding:36, marginBottom:20 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:16 }}>Test Completed!</h2>
          <div style={{
            width:110, height:110, borderRadius:'50%',
            background:'linear-gradient(135deg,var(--primary),#a855f7)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            margin:'0 auto 20px', boxShadow:'0 0 40px var(--primary-g)',
          }}>
            <div style={{ fontSize:26, fontWeight:800, color:'white' }}>{result.pct}%</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>SCORE</div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:28 }}>
            <div><div style={{ fontSize:22, fontWeight:800, color:'var(--green)' }}>{result.correct}</div><div style={{ fontSize:12, color:'var(--text3)' }}>Correct</div></div>
            <div><div style={{ fontSize:22, fontWeight:800, color:'var(--red)' }}>{result.wrong}</div><div style={{ fontSize:12, color:'var(--text3)' }}>Wrong</div></div>
            <div><div style={{ fontSize:22, fontWeight:800, color:'var(--text3)' }}>{result.skip}</div><div style={{ fontSize:12, color:'var(--text3)' }}>Skipped</div></div>
          </div>
        </div>

        <div className="card mb-16">
          <div className="section-title mb-16">Review Answers</div>
          {questions.map((q, i) => {
            const sel = answers[i]; const isCorrect = sel === q.correctOption;
            return (
              <div key={i} style={{ borderLeft:`3px solid ${isCorrect?'var(--green)':sel===undefined?'var(--border2)':'var(--red)'}`, paddingLeft:14, marginBottom:16 }}>
                <p style={{ fontWeight:500, fontSize:13, marginBottom:8 }}>{i+1}. {q.questionText}</p>
                <p style={{ fontSize:12, color: isCorrect?'var(--green)':sel===undefined?'var(--text3)':'var(--red)', marginBottom:4 }}>
                  {isCorrect ? '✓ Correct' : sel===undefined ? '— Skipped' : `✗ Wrong — You chose: ${q.options[sel]}`}
                </p>
                {!isCorrect && <p style={{ fontSize:12, color:'var(--green)', marginBottom:4 }}>Correct: {q.options[q.correctOption]}</p>}
                <p style={{ fontSize:11, color:'var(--text3)', background:'var(--bg4)', borderRadius:6, padding:'6px 10px' }}>💡 {q.explanation}</p>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={() => setView('home')}>
          <i className="fas fa-home" /> Back to Aptitude
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Aptitude Preparation</h1>
        <p>Choose a category and topic to start a timed test</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:22, flexWrap:'wrap' }}>
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:5 }}>Difficulty</label>
          <select className="input" style={{ width:130 }} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:'var(--text2)', display:'block', marginBottom:5 }}>Questions</label>
          <select className="input" style={{ width:100 }} value={count} onChange={e=>setCount(+e.target.value)}>
            <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
          </select>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {cats.map(cat => (
          <div key={cat.id} className="card" style={{ border:`1px solid var(--border)`, transition:'var(--transition)' }}
            onMouseOver={e=>{e.currentTarget.style.borderColor=cat.border;e.currentTarget.style.background=cat.color;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='rgba(255,255,255,0.025)';}}
          >
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:46, height:46, borderRadius:13, background:cat.color, border:`1px solid ${cat.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{cat.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{cat.id}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{cat.topics.length} Topics</div>
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {cat.topics.map(t => (
                <button
                  key={t} className="tag"
                  style={{ cursor:'pointer', transition:'var(--transition)' }}
                  onClick={() => startTest(cat.id, t)}
                  onMouseOver={e=>{e.currentTarget.style.background=cat.color;e.currentTarget.style.color=cat.accent;e.currentTarget.style.borderColor=cat.border;}}
                  onMouseOut={e=>{e.currentTarget.style.background='var(--bg4)';e.currentTarget.style.color='var(--text2)';e.currentTarget.style.borderColor='var(--border2)';}}
                >{t}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}