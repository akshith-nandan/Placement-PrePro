import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { progress as progressAPI } from '../api';

export default function Dashboard({ onNav }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressAPI.get().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return <div style={s.loading}>Loading dashboard...</div>;

  const stats = data?.stats || {};
  const companyReadiness = data?.companyReadiness || {};
  const skillMastery = data?.skillMastery || {};

  const agenda = [
    { time: '09:00', title: 'Quantitative Aptitude Quiz', meta: '10 questions · 15 min', diff: 'Easy', color: 'var(--success)' },
    { time: '14:00', title: 'Dynamic Programming Practice', meta: '5 problems · 90 min', diff: 'Medium', color: 'var(--warning)' },
    { time: '19:00', title: 'TCS Mock Test – Full Length', meta: '5 questions · 20 min', diff: 'Hard', color: 'var(--danger)' },
  ];

  const companyColors = { TCS: '#0080ff', Infosys: '#8b5cf6', Wipro: '#f59e0b', Cognizant: '#10b981', Accenture: '#ef4444', Zoho: '#06b6d4', Amazon: '#ff9900', Google: '#4285f4' };

  return (
    <div style={s.page} className="fade-in">
      <div style={s.header}>
        <div>
          <div style={s.title}>{greeting}, <span style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0]}</span> 👋</div>
          <div style={s.sub}>You have 3 sessions scheduled today. Keep the streak alive!</div>
        </div>
        <div style={s.streakBadge}>🔥 {stats.streak || 0} day streak</div>
      </div>

      {/* Stats Grid */}
      <div style={s.statsGrid}>
        {[
          { label: 'PROBLEMS SOLVED', val: `${stats.problemsSolved || 0}/${stats.totalProblems || 12}`, sub: 'DSA problems', pct: ((stats.problemsSolved || 0) / (stats.totalProblems || 12)) * 100, color: 'var(--accent)' },
          { label: 'QUIZ ACCURACY', val: `${stats.quizAccuracy || 0}%`, sub: 'Average score', pct: stats.quizAccuracy || 0, color: 'var(--accent2)' },
          { label: 'MOCK TESTS DONE', val: stats.mockTestsDone || 0, sub: 'Completed tests', pct: ((stats.mockTestsDone || 0) / 10) * 100, color: 'var(--accent3)' },
          { label: 'STUDY HOURS', val: `${stats.totalStudyHours || 0}h`, sub: 'Total logged', pct: Math.min(100, ((stats.totalStudyHours || 0) / 200) * 100), color: '#f472b6' },
        ].map(card => (
          <div key={card.label} style={s.statCard}>
            <div style={s.statLabel}>{card.label}</div>
            <div style={{ ...s.statVal, color: card.color }}>{card.val}</div>
            <div style={s.statSub}>{card.sub}</div>
            <div style={s.progBar}><div style={{ ...s.progFill, width: `${card.pct}%`, background: card.color }} /></div>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* Today's Agenda */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Today's Agenda</span>
            <span style={s.cardMeta}>3 sessions</span>
          </div>
          <div style={s.cardBody}>
            {agenda.map((item, i) => (
              <div key={i} style={s.agendaItem}>
                <div style={{ ...s.agendaTime, color: item.color }}>{item.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.agendaTitle}>{item.title}</div>
                  <div style={s.agendaMeta}>{item.meta}</div>
                </div>
                <span style={{ ...s.badge, background: `${item.color}22`, color: item.color }}>{item.diff}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Skill Mastery</span>
            <span style={s.cardMeta}>Focus areas</span>
          </div>
          <div style={s.cardBody}>
            {Object.entries(skillMastery).map(([skill, pct]) => (
              <div key={skill} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{skill}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{pct}%</span>
                </div>
                <div style={s.progBar}>
                  <div style={{ ...s.progFill, width: `${pct}%`, background: pct < 40 ? 'linear-gradient(90deg, var(--danger), var(--warning))' : pct < 70 ? 'linear-gradient(90deg, var(--accent2), var(--accent))' : 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Readiness */}
      <div style={s.card}>
        <div style={s.cardHead}>
          <span style={s.cardTitle}>Company Readiness</span>
          <span style={s.cardMeta}>Based on your performance</span>
        </div>
        <div style={{ ...s.cardBody, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {Object.entries(companyReadiness).map(([company, score]) => (
            <div key={company} style={{ textAlign: 'center', padding: '16px 12px', background: 'var(--surface2)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px' }}>{company}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: companyColors[company] || 'var(--accent)', marginBottom: '6px' }}>{score}%</div>
              <div style={s.miniProg}><div style={{ height: '100%', width: `${score}%`, background: companyColors[company] || 'var(--accent)', borderRadius: '99px', transition: 'width 0.5s' }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={s.quickGrid}>
        {[
          { icon: '🧮', label: 'Start Quiz', sub: 'Aptitude practice', page: 'aptitude', color: 'var(--accent2)' },
          { icon: '⌨', label: 'Solve Problem', sub: 'DSA challenge', page: 'coding', color: 'var(--accent)' },
          { icon: '📝', label: 'Take Mock Test', sub: 'TCS / Infosys', page: 'mock', color: 'var(--accent3)' },
          { icon: '📈', label: 'View Progress', sub: 'Stats & achievements', page: 'progress', color: '#f472b6' },
        ].map(a => (
          <button key={a.page} style={{ ...s.quickCard, borderColor: 'var(--border)' }} onClick={() => onNav(a.page)}
            onMouseEnter={e => e.currentTarget.style.borderColor = a.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{a.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{a.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{a.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '28px', maxWidth: '1100px' },
  loading: { padding: '60px', textAlign: 'center', color: 'var(--muted)' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' },
  title: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginTop: '4px' },
  streakBadge: { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--accent3)', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' },
  statLabel: { fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '8px' },
  statVal: { fontSize: '26px', fontWeight: 800, letterSpacing: '-1px' },
  statSub: { fontSize: '12px', color: 'var(--muted)', marginTop: '4px' },
  progBar: { height: '5px', background: 'var(--surface3)', borderRadius: '99px', overflow: 'hidden', marginTop: '10px' },
  progFill: { height: '100%', borderRadius: '99px', transition: 'width 0.5s' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px' },
  cardHead: { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '15px', fontWeight: 700 },
  cardMeta: { fontSize: '12px', color: 'var(--muted)' },
  cardBody: { padding: '20px' },
  agendaItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  agendaTime: { fontSize: '12px', fontWeight: 700, fontFamily: 'var(--mono)', width: '48px', flexShrink: 0 },
  agendaTitle: { fontSize: '13px', fontWeight: 600 },
  agendaMeta: { fontSize: '12px', color: 'var(--muted)', marginTop: '2px' },
  badge: { padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 },
  miniProg: { height: '3px', background: 'var(--bg)', borderRadius: '99px', overflow: 'hidden' },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginTop: '20px' },
  quickCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', fontFamily: 'var(--font)' },
};