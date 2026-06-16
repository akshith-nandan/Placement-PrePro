import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = ['#7c6af7','#22c55e','#f59e0b','#3b82f6'];

function HeatmapCell({ level }) {
  const cls = ['hm-cell', level > 0 ? `hm-l${Math.min(level,4)}` : ''].join(' ');
  return <div className={cls} title={`${level} activities`} />;
}

function Heatmap() {
  const cells = Array.from({ length: 52 * 7 }, () => Math.random() > 0.65 ? Math.ceil(Math.random() * 4) : 0);
  return (
    <div>
      <div className="heatmap-grid">
        {cells.map((v, i) => <HeatmapCell key={i} level={v} />)}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, fontSize:11, color:'var(--text3)' }}>
        <span>Less</span>
        {[0,1,2,3,4].map(l => <div key={l} className={`hm-cell ${l>0?`hm-l${l}`:''}`} style={{ width:12, height:12, borderRadius:2 }} />)}
        <span>More</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg4)', border:'1px solid var(--border2)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'var(--text)' }}>
      {payload.map((p, i) => <div key={i}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(r => setStats(r.data)).catch(() => {
      setStats({ quizzesAttempted:0, codingProblemsSolved:0, mockTestsTaken:0, streakCount:0, skillScore:0, aptitudeAccuracy:0, codingAccuracy:0 });
    });
  }, []);

  const weeklyData = [
    { day:'Mon', questions:8 }, { day:'Tue', questions:14 }, { day:'Wed', questions:6 },
    { day:'Thu', questions:18 }, { day:'Fri', questions:10 }, { day:'Sat', questions:22 }, { day:'Sun', questions:5 },
  ];

  const topicData = [
    { name:'Quant', acc:78 }, { name:'Logical', acc:65 }, { name:'Verbal', acc:82 },
    { name:'DI', acc:70 }, { name:'Arrays', acc:60 }, { name:'DP', acc:48 },
  ];

  const pieData = [
    { name:'Solved', value: stats?.codingProblemsSolved || 0 },
    { name:'Remaining', value: Math.max(0, 50 - (stats?.codingProblemsSolved || 0)) },
  ];

  const statCards = [
    { icon:'fa-clipboard-check', label:'Quizzes Attempted', value: stats?.quizzesAttempted ?? 0,  cls:'c-purple i-purple', trend:'+3 this week' },
    { icon:'fa-code',            label:'Problems Solved',   value: stats?.codingProblemsSolved ?? 0,cls:'c-green i-green',   trend:'+2 today' },
    { icon:'fa-file-lines',      label:'Mock Tests Taken',  value: stats?.mockTestsTaken ?? 0,     cls:'c-yellow i-yellow', trend:'View results' },
    { icon:'fa-star',            label:'Skill Score',       value: `${stats?.skillScore ?? 0}/100`, cls:'c-blue i-blue',    trend:'Keep going!' },
  ];

  const quickActions = [
    { icon:'🧮', label:'Practice Aptitude', desc:'Timed quizzes', color:'rgba(124,106,247,0.1)', border:'rgba(124,106,247,0.2)', to:'/aptitude' },
    { icon:'💻', label:'Solve a Problem',   desc:'DSA practice',  color:'rgba(34,197,94,0.08)',   border:'rgba(34,197,94,0.2)',   to:'/coding' },
    { icon:'📝', label:'Take Mock Test',    desc:'Full simulation',color:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.2)',  to:'/mocktests' },
    { icon:'📄', label:'Build Resume',      desc:'ATS-ready',     color:'rgba(236,72,153,0.08)',   border:'rgba(236,72,153,0.2)', to:'/resume' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text)', letterSpacing:-0.5 }}>
            Welcome back, <span className="grad-text">{user?.name?.split(' ')[0] || 'Student'}</span> 👋
          </h1>
          <p style={{ color:'var(--text2)', marginTop:4, fontSize:14 }}>Here's your placement prep overview.</p>
        </div>
        {user?.streakCount > 0 && (
          <div className="streak-chip">🔥 {user.streakCount} day streak</div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="stats-row">
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.cls.split(' ')[0]}`}>
            <div className={`stat-icon ${s.cls.split(' ')[1]}`}>
              <i className={`fas ${s.icon}`} style={{ color: ['var(--primary)','var(--green)','var(--yellow)','var(--blue)'][i] }} />
            </div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-trend up"><i className="fas fa-arrow-trend-up" />{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Weekly Activity</div>
              <div className="section-sub">Questions solved per day</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="questions" fill="#7c6af7" radius={[6,6,0,0]}
                label={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Topic Performance</div>
              <div className="section-sub">Accuracy by subject</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topicData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0,100]} tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="acc" radius={[0,6,6,0]}
                fill="url(#barGrad)"
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c6af7" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card mb-24">
        <div className="section-header">
          <div>
            <div className="section-title">Activity Heatmap</div>
            <div className="section-sub">Your practice consistency over the past year</div>
          </div>
          <span className="badge badge-purple">GitHub style</span>
        </div>
        <Heatmap />
      </div>

      {/* Accuracy + Quick Actions */}
      <div className="grid-2">
        <div className="card">
          <div className="section-title mb-16">Accuracy Overview</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { label:'Aptitude Accuracy', val: stats?.aptitudeAccuracy ?? 78, cls:'pf-purple' },
              { label:'Coding Accuracy',   val: stats?.codingAccuracy  ?? 65, cls:'pf-green' },
              { label:'Mock Test Score',   val: 71,                           cls:'pf-yellow' },
              { label:'Skill Score',       val: stats?.skillScore      ?? 60, cls:'pf-blue' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}>
                  <span style={{ color:'var(--text2)' }}>{row.label}</span>
                  <span style={{ fontWeight:700, color:'var(--text)' }}>{row.val}%</span>
                </div>
                <div className="progress-wrap">
                  <div className={`progress-fill ${row.cls}`} style={{ width:`${row.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title mb-16">Quick Actions</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {quickActions.map(a => (
              <div
                key={a.label} onClick={() => navigate(a.to)}
                style={{
                  padding:16, borderRadius:'var(--r-sm)',
                  background: a.color, border:`1px solid ${a.border}`,
                  cursor:'pointer', transition:'var(--transition)',
                  textAlign:'center',
                }}
                onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform=''}
              >
                <div style={{ fontSize:26, marginBottom:6 }}>{a.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{a.label}</div>
                <div style={{ fontSize:11, color:'var(--text3)' }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}