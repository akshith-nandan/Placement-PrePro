import React, { useState } from 'react';

const COMPANIES = [
  { name:'TCS', emoji:'🔵', color:'rgba(59,130,246,0.15)', border:'rgba(59,130,246,0.3)', pattern:'TCS NQT → Technical Interview → HR Interview', cutoff:'60% aggregate, no active backlogs', questions:['What is normalization?','Explain OOPs concepts','Reverse a string','ACID properties in DBMS'], experiences:[{ name:'Ravi Kumar', role:'ASE', rating:4, text:'Aptitude focused on quant and reasoning. Technical covered Java and DBMS basics. HR round was about career goals.' }] },
  { name:'Infosys', emoji:'🟣', color:'rgba(168,85,247,0.1)', border:'rgba(168,85,247,0.3)', pattern:'InfyTQ / HackWithInfy → Technical Interview → HR Interview', cutoff:'65% aggregate, no current backlogs', questions:['Explain SDLC models','Process vs thread','SQL second highest salary','What is polymorphism?'], experiences:[{ name:'Sneha Reddy', role:'Systems Engineer', rating:5, text:'2 medium DSA problems in coding round. Technical focused on projects. HR was very friendly.' }] },
  { name:'Wipro', emoji:'🟢', color:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.25)', pattern:'NLTH Aptitude → Technical Interview → HR Interview', cutoff:'60% throughout academics', questions:['What is polymorphism?','TCP vs UDP','Find duplicates in array','Cloud computing basics'], experiences:[] },
  { name:'Accenture', emoji:'🟠', color:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', pattern:'Cognitive Ability + Coding Round → HR Interview', cutoff:'65% aggregate', questions:['IaaS vs PaaS vs SaaS','ACID properties','Implement stack','Binary search'], experiences:[] },
  { name:'Cognizant', emoji:'🔷', color:'rgba(6,182,212,0.08)', border:'rgba(6,182,212,0.25)', pattern:'GenC Test → Coding Round → Technical + HR Interview', cutoff:'60% aggregate, max 1 backlog', questions:['Explain inheritance','Indexing in databases','Find missing number','MVC pattern'], experiences:[] },
  { name:'Amazon', emoji:'🟡', color:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', pattern:'OA (2 DSA + Debug) → Phone Screen → Loop (4-5 rounds)', cutoff:'Strong DSA + LP principles', questions:['Design a parking lot','Find median of two sorted arrays','LRU Cache implementation','Leadership principle scenarios'], experiences:[] },
];

function Stars({ n }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <i key={i} className="fas fa-star" style={{ fontSize:12, color: i<=n ? '#f59e0b' : '#1c1c28', marginRight:1 }} />
      ))}
    </span>
  );
}

export default function Companies() {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ role:'', rating:5, experience:'' });
  const [submitted, setSubmitted] = useState(false);

  const s = {
    card: { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 },
    input: { width:'100%', background:'#16161f', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px', color:'#f0f0f5', fontSize:13, outline:'none' },
    btn: (primary) => ({ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', background: primary ? 'linear-gradient(135deg,#7c6af7,#a855f7)' : 'rgba(255,255,255,0.06)', color: primary ? 'white' : '#9898b8' }),
  };

  if (selected) {
    const c = COMPANIES.find(x => x.name === selected);
    return (
      <div style={{ maxWidth:760 }}>
        <button onClick={() => { setSelected(null); setSubmitted(false); }} style={{ display:'flex', alignItems:'center', gap:7, background:'none', border:'none', color:'#7c6af7', fontWeight:600, fontSize:13, cursor:'pointer', marginBottom:18 }}>
          <i className="fas fa-arrow-left" /> Back to Companies
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
          <div style={{ fontSize:44 }}>{c.emoji}</div>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#f0f0f5' }}>{c.name}</h1>
            <p style={{ fontSize:13, color:'#9898b8', marginTop:3 }}>Cutoff: {c.cutoff}</p>
          </div>
        </div>

        <div style={{ ...s.card, padding:20, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#7c6af7', marginBottom:10 }}>📋 Hiring Pattern</div>
          <p style={{ fontSize:14, color:'#9898b8', lineHeight:1.7 }}>{c.pattern}</p>
        </div>

        <div style={{ ...s.card, padding:20, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#7c6af7', marginBottom:12 }}>📚 Previous Questions</div>
          {c.questions.map((q,i) => (
            <div key={i} style={{ padding:'10px 14px', background:'#16161f', borderRadius:10, marginBottom:8, fontSize:13, color:'#9898b8', borderLeft:'3px solid #7c6af7' }}>{q}</div>
          ))}
        </div>

        <div style={{ ...s.card, padding:20, marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#7c6af7', marginBottom:14 }}>💬 Interview Experiences</div>
          {c.experiences.length === 0 && <p style={{ color:'#55556a', fontSize:13 }}>No experiences shared yet. Be the first!</p>}
          {c.experiences.map((exp,i) => (
            <div key={i} style={{ background:'#16161f', borderRadius:12, padding:16, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div>
                  <span style={{ fontWeight:600, fontSize:14, color:'#f0f0f5' }}>{exp.name}</span>
                  {exp.role && <span style={{ fontSize:12, color:'#55556a', marginLeft:8 }}>• {exp.role}</span>}
                </div>
                <Stars n={exp.rating} />
              </div>
              <p style={{ fontSize:13, color:'#9898b8', lineHeight:1.6 }}>{exp.text}</p>
            </div>
          ))}
        </div>

        <div style={{ ...s.card, padding:20 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#f0f0f5', marginBottom:14 }}>✍️ Share Your Experience</div>
          {submitted
            ? <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, padding:14, color:'#4ade80', fontSize:13 }}>🎉 Thanks for sharing! Your experience helps other students.</div>
            : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#9898b8', display:'block', marginBottom:6 }}>Role</label>
                    <input style={s.input} placeholder="e.g. Software Engineer" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#9898b8', display:'block', marginBottom:6 }}>Rating</label>
                    <select style={s.input} value={form.rating} onChange={e=>setForm({...form,rating:+e.target.value})}>
                      {[5,4,3,2,1].map(r=><option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#9898b8', display:'block', marginBottom:6 }}>Experience</label>
                  <textarea style={{ ...s.input, minHeight:90, resize:'vertical' }} placeholder="Describe the interview rounds, questions asked, tips for other students..." value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} />
                </div>
                <button onClick={() => { if (form.experience) setSubmitted(true); }} style={s.btn(true)}>
                  <i className="fas fa-paper-plane" /> Submit Experience
                </button>
              </div>
            )
          }
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#f0f0f5', letterSpacing:-0.5 }}>Company-Wise Preparation</h1>
        <p style={{ color:'#9898b8', marginTop:4, fontSize:14 }}>Explore hiring patterns, previous questions, and interview experiences</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {COMPANIES.map(c => (
          <div key={c.name}
            onClick={() => setSelected(c.name)}
            style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:20, cursor:'pointer', transition:'all .25s' }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=c.border; e.currentTarget.style.background=c.color; }}
            onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(255,255,255,0.025)'; }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:c.color, border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{c.emoji}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:16, color:'#f0f0f5' }}>{c.name}</div>
                <div style={{ fontSize:11, color:'#55556a', marginTop:2 }}>Cutoff: {c.cutoff.split(',')[0]}</div>
              </div>
            </div>
            <p style={{ fontSize:12, color:'#9898b8', marginBottom:14, lineHeight:1.5 }}>{c.pattern}</p>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'#7c6af7' }}><i className="fas fa-question-circle" style={{ marginRight:5 }} />{c.questions.length} Questions</span>
              <span style={{ color:'#22c55e' }}><i className="fas fa-comment-dots" style={{ marginRight:5 }} />{c.experiences.length} Reviews</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}