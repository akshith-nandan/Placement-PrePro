import React, { useEffect, useState } from 'react';
import { materials } from '../api';

const CAT_COLORS = { 'Core CS': { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' }, 'Theory': { bg: 'rgba(0,212,170,0.12)', color: '#00d4aa' }, 'Quick Ref': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' }, 'Career': { bg: 'rgba(244,114,182,0.12)', color: '#f472b6' }, 'Company': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' }, 'Advanced': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' } };

export default function StudyMaterials() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    materials.getAll().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.category))];
  const pinned = items.filter(i => i.pinned);
  const filtered = items.filter(i =>
    (filter === 'All' || i.category === filter) &&
    (search === '' || i.title.toLowerCase().includes(search.toLowerCase()) || i.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  if (loading) return <div style={s.loading}>Loading materials...</div>;

  return (
    <div style={s.page} className="fade-in">
      <div style={s.hdr}>
        <div>
          <div style={s.title}>Study Materials</div>
          <div style={s.sub}>Curated resources for placement success</div>
        </div>
        <input style={s.search} placeholder="🔍  Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Pinned */}
      {pinned.length > 0 && search === '' && filter === 'All' && (
        <div style={{ marginBottom: '28px' }}>
          <div style={s.sectionTitle}>📌 Pinned Resources</div>
          <div style={s.pinnedGrid}>
            {pinned.map(item => (
              <div key={item.id} style={s.pinnedCard}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={s.pinnedIcon}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.pinnedTitle}>{item.title}</div>
                  <div style={s.pinnedDesc}>{item.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.type} · {item.pages} pages</span>
                    <button style={s.dlBtn}>⬇ Download</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map(c => (
          <button key={c} style={{ ...s.filterBtn, background: filter === c ? 'var(--accent2)' : 'transparent', borderColor: filter === c ? 'var(--accent2)' : 'var(--border2)', color: filter === c ? 'white' : 'var(--muted)' }} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {filtered.filter(i => !i.pinned || filter !== 'All' || search !== '').map(item => {
          const catStyle = CAT_COLORS[item.category] || CAT_COLORS['Core CS'];
          return (
            <div key={item.id} style={s.matCard}
              onMouseEnter={e => { e.currentTarget.style.borderColor = catStyle.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={s.matIcon}>{item.icon}</div>
              <div style={s.matTitle}>{item.title}</div>
              <div style={s.matDesc}>{item.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                {item.tags?.slice(0, 3).map(tag => (
                  <span key={tag} style={s.tag}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <span style={{ ...s.catBadge, ...catStyle }}>{item.category}</span>
                <button style={s.viewBtn}>View →</button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontWeight: 600 }}>No materials found</div>
          <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>Try a different search or category</div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '28px', maxWidth: '1100px' },
  loading: { padding: '60px', textAlign: 'center', color: 'var(--muted)' },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '20px' },
  title: { fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' },
  sub: { color: 'var(--muted)', fontSize: '14px', marginTop: '4px' },
  search: { padding: '10px 16px', border: '1px solid var(--border2)', borderRadius: '10px', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', outline: 'none', width: '260px' },
  sectionTitle: { fontSize: '15px', fontWeight: 700, marginBottom: '14px' },
  pinnedGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' },
  pinnedCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', cursor: 'pointer', transition: 'border-color 0.2s' },
  pinnedIcon: { fontSize: '32px', flexShrink: 0 },
  pinnedTitle: { fontSize: '14px', fontWeight: 700, marginBottom: '6px' },
  pinnedDesc: { fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 },
  dlBtn: { padding: '5px 12px', border: '1px solid var(--border2)', borderRadius: '6px', background: 'transparent', color: 'var(--accent2)', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  filterBtn: { padding: '7px 14px', border: '1px solid', borderRadius: '8px', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  matCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' },
  matIcon: { fontSize: '32px', marginBottom: '12px' },
  matTitle: { fontSize: '14px', fontWeight: 700, marginBottom: '6px' },
  matDesc: { fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 },
  tag: { fontSize: '11px', background: 'var(--surface2)', color: 'var(--muted)', padding: '2px 8px', borderRadius: '5px' },
  catBadge: { padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 },
  viewBtn: { padding: '6px 14px', border: 'none', borderRadius: '7px', background: 'var(--surface2)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px', color: 'var(--muted)' },
};