import React, { useState, useEffect, useCallback } from 'react';

const QUESTIONS = [
  { id:1, text:'A shopkeeper buys for ₹400 and sells for ₹500. Profit %?', options:['20%','25%','15%','30%'], correct:1, explanation:'Profit=100, Profit%=25%', diff:'Easy' },
  { id:2, text:'A completes work in 10 days, B in 15. Together?', options:['5 days','6 days','8 days','9 days'], correct:1, explanation:'Combined rate=1/6, so 6 days', diff:'Easy' },
  { id:3, text:'Next in series: 2, 6, 12, 20, 30, ?', options:['40','42','44','46'], correct:1, explanation:'Differences: 4,6,8,10,12. Next=42', diff:'Easy' },
  { id:4, text:'35% of 280 = ?', options:['90','95','98','105'], correct:2, explanation:'280×0.35=98', diff:'Easy' },
  { id:5, text:'Synonym of Benevolent:', options:['Cruel','Kind','Greedy','Lazy'], correct:1, explanation:'Benevolent = kind, generous', diff:'Easy' },
  { id:6, text:'A train 100m long passes a pole in 10s. Speed?', options:['10 m/s','12 m/s','8 m/s','15 m/s'], correct:0, explanation:'Speed=100/10=10 m/s', diff:'Easy' },
  { id:7, text:'25% of total = 200. Total = ?', options:['600','700','800','900'], correct:2, explanation:'200/0.25=800', diff:'Easy' },
  { id:8, text:'Correct sentence:', options:["He don't like it.","He doesn't likes it.","He doesn't like it.","He not like it."], correct:2, explanation:"doesn't + base verb is correct", diff:'Easy' },
  { id:9, text:'If 3x+5=20, x=?', options:['3','4','5','6'], correct:2, explanation:'3x=15, x=5', diff:'Easy' },
  { id:10, text:'B(2)+I(9)+G(7)=? (coding-decoding)', options:['18','20','22','24'], correct:0, explanation:'2+9+7=18', diff:'Medium' },
];

const diffBadge = d => ({
  Easy: { bg:'rgba(34,197,94,0.1)', color:'#4ade80' },
  Medium: { bg:'rgba(245,158,11,0.1)', color:'#fbbf24' },
  Hard: { bg:'rgba(239,68,68,0.1)', color:'#f87171' },
}[d] || { bg:'rgba(124,106,247,0.1)', color:'#7c6af7' });

export default function MockTests() {
  const [view, setView] = useState('home'); // home | test | result
  const [testType, setTestType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const startTest = (type, count, duration) => {
    const pool = [...QUESTIONS].sort(() => Math.random()-0.5).slice(0, Math.min(count, QUESTIONS.length));
    setTestType(type); setQuestions(pool); setAnswers({});
    setCurrent(0); setTimeLeft(duration * 60); setView('test');
  };

  const submitTest = useCallback(() => {
    let correct=0, wrong=0, skip=0;
    questions.forEach((q,i) => {
      if (answers[i] === undefined) skip++;
      else if (answers[i] === q.correct) correct++;
      else wrong++;
    });
    const pct = Math.round((correct/questions.length)*100);
    const r = { correct, wrong, skip, total:questions.length, pct, testType, date: new Date().toLocaleDateString() };
    setResult(r);
    setHistory(h => [r, ...h]);
    setView('result');
  }, [questions, answers, testType]);

  useEffect(() => {
    if (view !== 'test') return;
    if (timeLeft <= 0) { submitTest(); return; }
    const t = setInterval(() => setTimeLeft(s => s-1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, view, submitTest]);

  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  const s = {
    card: { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:20 },
    opt: (sel) => ({ width:'100%', textAlign:'left', padding:'13px 16px', marginBottom:8, background: sel?'rgba(124,106,247,0.14)':'#16161f', border:`1.5px solid ${sel?'#7c6af7':'rgba(255,255,255,0.1)'}`, borderRadius:10, color: sel?'#f0f0f5':'#9898b8', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:12, transition:'all .2s' }),
    btn: (primary, danger) => ({ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', background: danger ? 'rgba(239,68,68,0.15)' : primary ? 'linear-gradient(135deg,#7c6af7,#a855f7)' : 'rgba(255,255,255,0.07)', color: danger ? '#f87171' : primary ? 'white' : '#9898b8', transition:'all .2s' }),
    navBtn: (state) => ({ aspectRatio:'1', minWidth:32, borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, transition:'all .2s', background: state==='current'?'#7c6af7':state==='answered'?'rgba(34,197,94,0.2)':'#1c1c28', color: state==='current'?'white':state==='answered'?'#4ade80':'#55556a' }),
  };

  if (view === 'test') {
    const q = questions[current];
    return (
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, background:'#111118', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'14px 20px' }}>
          <div>
            <div style={{ fontWeight:700, color:'#f0f0f5' }}>{testType}</div>
            <div style={{ fontSize:12, color:'#55556a', marginTop:2 }}>Question {current+1} of {questions.length}</div>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color: timeLeft<60?'#ef4444':'#f0f0f5', fontVariantNumeric:'tabular-nums', animation: timeLeft<60?'pulse 1s infinite':'none' }}>
            ⏱ {fmt(timeLeft)}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 160px', gap:16 }}>
          <div>
            <div style={s.card}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <span style={{ fontSize:13, color:'#55556a' }}>Q{current+1}</span>
                <span style={{ ...diffBadge(q.diff), padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>{q.diff}</span>
              </div>
              <p style={{ fontSize:15, fontWeight:500, color:'#f0f0f5', lineHeight:1.7, marginBottom:22 }}>{q.text}</p>
              {q.options.map((opt,i) => (
                <button key={i} style={s.opt(answers[current]===i)} onClick={() => setAnswers({...answers,[current]:i})}>
                  <span style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                    {['A','B','C','D'][i]}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:14 }}>
              <button style={s.btn()} disabled={current===0} onClick={() => setCurrent(c=>c-1)}><i className="fas fa-chevron-left" /> Previous</button>
              <button style={s.btn(false, true)} onClick={submitTest}><i className="fas fa-paper-plane" /> Submit</button>
              {current < questions.length-1
                ? <button style={s.btn(true)} onClick={() => setCurrent(c=>c+1)}>Next <i className="fas fa-chevron-right" /></button>
                : <button style={s.btn(true)} onClick={submitTest}><i className="fas fa-check" /> Finish</button>
              }
            </div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:14, alignSelf:'start' }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#55556a', marginBottom:10 }}>Questions</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4 }}>
              {questions.map((_,i) => (
                <button key={i} style={s.navBtn(i===current?'current':answers[i]!==undefined?'answered':'unanswered')} onClick={() => setCurrent(i)}>{i+1}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div style={{ maxWidth:660 }}>
        <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:36, textAlign:'center', marginBottom:20 }}>
          <div style={{ fontSize:52, marginBottom:14 }}>🏆</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#f0f0f5', marginBottom:20 }}>Test Submitted!</h2>
          <div style={{ width:120, height:120, borderRadius:'50%', background:'linear-gradient(135deg,#7c6af7,#a855f7)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 0 40px rgba(124,106,247,0.3)' }}>
            <div style={{ fontSize:28, fontWeight:800, color:'white' }}>{result.pct}%</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>SCORE</div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:32 }}>
            <div><div style={{ fontSize:22, fontWeight:800, color:'#22c55e' }}>{result.correct}</div><div style={{ fontSize:12, color:'#55556a', marginTop:3 }}>Correct</div></div>
            <div><div style={{ fontSize:22, fontWeight:800, color:'#ef4444' }}>{result.wrong}</div><div style={{ fontSize:12, color:'#55556a', marginTop:3 }}>Wrong</div></div>
            <div><div style={{ fontSize:22, fontWeight:800, color:'#55556a' }}>{result.skip}</div><div style={{ fontSize:12, color:'#55556a', marginTop:3 }}>Skipped</div></div>
          </div>
        </div>
        <button onClick={() => setView('home')} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#7c6af7,#a855f7)', color:'white' }}>
          <i className="fas fa-home" /> Back to Mock Tests
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#f0f0f5', letterSpacing:-0.5 }}>Mock Tests</h1>
        <p style={{ color:'#9898b8', marginTop:4, fontSize:14 }}>Simulate real placement tests with timed sessions</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16, marginBottom:28 }}>
        {[
          { type:'Aptitude Mock Test', icon:'🧮', desc:'30 Questions • 30 Minutes', tags:['Quant','Logical','Verbal'], color:'rgba(124,106,247,0.1)', border:'rgba(124,106,247,0.25)', count:10, dur:30, btnLabel:'Start Aptitude Test', btnGrad:'linear-gradient(135deg,#7c6af7,#a855f7)' },
          { type:'Coding Mock Test', icon:'💻', desc:'2 Problems • 60 Minutes', tags:['Arrays','Strings','DP'], color:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.2)', count:5, dur:20, btnLabel:'Start Coding Test', btnGrad:'linear-gradient(135deg,#16a34a,#22c55e)' },
          { type:'Full Placement Test', icon:'🎯', desc:'30Q + 2 Problems • 90 Min', tags:['Aptitude','Coding','Full'], color:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.2)', count:10, dur:30, btnLabel:'Start Full Test', btnGrad:'linear-gradient(135deg,#d97706,#f59e0b)' },
        ].map(t => (
          <div key={t.type} style={{ background:t.color, border:`1px solid ${t.border}`, borderRadius:14, padding:20, transition:'all .25s' }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform=''}
          >
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:50, height:50, borderRadius:14, background:t.color, border:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:'#f0f0f5' }}>{t.type}</div>
                <div style={{ fontSize:12, color:'#55556a', marginTop:2 }}>{t.desc}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
              {t.tags.map(tag => <span key={tag} style={{ background:'rgba(255,255,255,0.06)', color:'#9898b8', padding:'3px 9px', borderRadius:99, fontSize:11, fontWeight:500 }}>{tag}</span>)}
            </div>
            <button onClick={() => startTest(t.type, t.count, t.dur)} style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', cursor:'pointer', background:t.btnGrad, color:'white', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              <i className="fas fa-play" /> {t.btnLabel}
            </button>
          </div>
        ))}
      </div>

      {/* History */}
      <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:700, fontSize:15, color:'#f0f0f5' }}>Test History</div>
        {history.length === 0
          ? <div style={{ padding:32, textAlign:'center', color:'#55556a', fontSize:14 }}>No tests taken yet. Start a mock test above!</div>
          : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['Test','Score','Correct','Date'].map(h => <th key={h} style={{ padding:'11px 16px', textAlign:'left', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#55556a' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {history.map((h,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'12px 16px', fontSize:13, color:'#9898b8' }}>{h.testType}</td>
                    <td style={{ padding:'12px 16px', fontWeight:700, color:'#7c6af7' }}>{h.pct}%</td>
                    <td style={{ padding:'12px 16px', color:'#22c55e', fontWeight:600 }}>{h.correct}/{h.total}</td>
                    <td style={{ padding:'12px 16px', fontSize:12, color:'#55556a' }}>{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  );
}