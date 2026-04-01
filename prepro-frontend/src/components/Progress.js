import React, { useEffect, useState } from 'react';
import { progress as progressAPI } from '../api';

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressAPI.get().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.loading}>Loading your progress...</div>;

  const stats = data?.stats || {};
  const skillMastery = data?.skillMastery || {};
  const companyReadiness = data?.companyReadiness || {};
  const achievements = data?.achievements || [];
  const activityDays = data?.activityDays || {};

  const activityEntries = Object.entries(activityDays).sort(([a], [b]) => a.localeCompare(b)).slice(-84);
  const getLevel = (count) => count === 0 ? '' : count <= 1 ? 'l1' : count <= 2 ? 'l2' : count <= 3 ? 'l3' : 'l4';
  const hmColors = { '': 'var(--surface2)', l1: 'rgba(0,212,170,0.2)', l2: 'rgba(0,212,170,0.45)', l3: 'rgba(0,212,170,0.7)', l4: 'var(--accent)' };

  const quizHistory = data?.quizHistory || [];
  const mockHistory = data?.mockHistory || [];

  return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}>
        <div style={s.title}>My Progress</div>
        <div style={s.sub}>Track your placement preparation journey</div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { label: 'PROBLEMS SOLVED', val: `${stats.problemsSolved || 0}/${stats.totalProblems || 12}`, sub: `${Math.round((stats.problemsSolved || 0) / (stats.totalProblems || 12) * 100)}% complete`, color: 'var(--accent)' },
          { label: 'QUIZ ACCURACY', val: `${stats.quizAccuracy || 0}%`, sub: 'Average across all quizzes', color: 'var(--accent2)' },
          { label: 'STREAK', val: `${stats.streak || 0}🔥`, sub: 'Consecutive days', color: 'var(--accent3)' },
          { label: 'MOCK TESTS', val: stats.mockTestsDone || 0, sub: 'Tests completed', color: '#f472b6' },
          { label: 'STUDY HOURS', val: `${stats.totalStudyHours || 0}h`, sub: 'Total logged', color: '#06b6d4' },
          { label: 'RANK', val: `#${stats.rank || 999}`, sub: 'Among all users', color: '#a78bfa' },
        ].map(c => (
          <div key={c.label} style={s.statCard}>
            <div style={s.statLabel}>{c.label}</div>
            <div style={{ ...s.statVal, color: c.color }}>{c.val}</div>
            <div style={s.statSub}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* Heatmap */}
        <div style={s.card}>
          <div style={s.cardHead}><span style={s.cardTitle}>Activity Heatmap</span><span style={s.cardMeta}>Last 12 weeks</span></div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
              {activityEntries.map(([date, count]) => (
                <div key={date} title={`${date}: ${count} sessions`} style={{ aspectRatio: 1, borderRadius: '3px', background: hmColors[getLevel(count)] || 'var(--surface2)', transition: 'opacity 0.2s', cursor: 'default' }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '11px', color: 'var(--muted)' }}>
              Less
              {['', 'l1', 'l2', 'l3', 'l4'].map(l => (
                <span key={l} style={{ width: '12px', height: '12px', borderRadius: '3px', background: hmColors[l] || 'var(--surface2)', display: 'inline-block' }} />
              ))}
              More
            </div>
          </div>
        </div>

        {/* Skill Mastery */}
        <div style={s.card}>
          <div style={s.cardHead}><span style={s.cardTitle}>Topic Mastery</span></div>
          <div style={{ padding: '20px' }}>
            {Object.entries(skillMastery).map(([skill, pct]) => (
              <div key={skill} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{skill}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{pct}%</span>
                </div>
                <div style={s.progBar}>
                  <div style={{ ...s.progFill, width: `${pct}%`, background: pct < 40 ? 'linear-gradient(90deg,#ef4444,#f59e0b)' : pct < 65 ? 'linear-gradient(90deg, var(--accent2), var(--accent))' : 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Readiness */}
      <div style={s.card}>
        <div style={s.cardHead}><span style={s.cardTitle}>Company Readiness</span><span style={s.cardMeta}>Performance-based score</span></div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {Object.entries(companyReadiness).map(([company, score]) => {
            const color = score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)';
            return (
              <div key={company} style={{ textAlign: 'center', padding: '16px', background: 'var(--surface2)', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px' }}>{company}</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color, marginBottom: '8px' }}>{score}%</div>
                <div style={{ height: '4px', background: 'var(--surface3)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '99px', transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div style={{ ...s.card, marginTop: '20px' }}>
        <div style={s.cardHead}>
          <span style={s.cardTitle}>Achievements</span>
          <span style={s.cardMeta}>{achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked</span>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {achievements.map(ach => (
            <div key={ach.id} style={{ ...s.achCard, opacity: ach.unlocked ? 1 : 0.35, filter: ach.unlocked ? 'none' : 'grayscale(1)' }}>
              <div style={{ fontSize: '28px' }}>{ach.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{ach.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{ach.desc}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: ach.unlocked ? 'rgba(245,158,11,0.15)' : 'var(--surface2)', color: ach.unlocked ? 'var(--accent3)' : 'var(--muted)', flexShrink: 0 }}>
                {ach.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {quizHistory.length > 0 && (
        <div style={{ ...s.card, marginTop: '20px' }}>
          <div style={s.cardHead}><span style={s.cardTitle}>Recent Quiz History</span></div>
          <div style={{ padding: '0 20px 16px' }}>
            {quizHistory.slice().reverse().map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < quizHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: h.score >= 70 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🧮</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>{h.category} Quiz</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{h.correct}/{h.total} correct · {new Date(h.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: h.score >= 70 ? 'var(--success)' : h.score >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{h.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mockHistory.length > 0 && (
        <div style={{ ...s.card, marginTop: '20px' }}>
          <div style={s.cardHead}><span style={s.cardTitle}>Recent Mock Tests</span></div>
          <div style={{ padding: '0 20px 16px' }}>
            {mockHistory.slice().reverse().map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < mockHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📝</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{h.testName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{h.correct}/{h.total} · {new Date(h.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: h.score >= 70 ? 'var(--success)' : h.score >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{h.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '28px', maxWidth: '1100px' },
  loading: { padding: '60px', textAlign: 'center', color: 'var(--muted)' },
  hdr: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' },
  statLabel: { fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '8px' },
  statVal: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  statSub: { fontSize: '12px', color: 'var(--muted)', marginTop: '4px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px' },
  cardHead: { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '15px', fontWeight: 700 },
  cardMeta: { fontSize: '12px', color: 'var(--muted)' },
  progBar: { height: '5px', background: 'var(--surface3)', borderRadius: '99px', overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: '99px', transition: 'width 0.5s' },
  achCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--surface2)', borderRadius: '12px', transition: 'opacity 0.2s' },
};