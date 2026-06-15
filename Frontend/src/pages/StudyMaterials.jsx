import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const categories = ['DSA', 'DBMS', 'OS', 'CN', 'OOPs', 'SQL'];

const categoryIcon = {
  DSA: '🧩',
  DBMS: '🗄️',
  OS: '💾',
  CN: '🌐',
  OOPs: '📦',
  SQL: '🔍'
};

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/materials', { params });
        setMaterials(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchMaterials, 300);
    return () => clearTimeout(debounce);
  }, [category, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Study Materials</h1>
      <p className="text-slate-500 mb-6">Browse curated notes and videos across core CS subjects.</p>

      <div className="card mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Search by topic</label>
          <input className="input-field" placeholder="e.g. Normalization, Sorting..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading materials...</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {materials.map((m) => (
            <a key={m._id} href={m.url} target="_blank" rel="noreferrer" className="card hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{categoryIcon[m.category] || '📘'}</span>
                <span className="badge bg-slate-100 text-slate-600">{m.category}</span>
                <span className={`badge ${m.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{m.type}</span>
              </div>
              <h3 className="font-semibold mb-1">{m.title}</h3>
              <p className="text-sm text-slate-500">{m.description}</p>
              <p className="text-primary text-sm font-medium mt-2">Open ↗</p>
            </a>
          ))}
        </div>
      )}

      {!loading && materials.length === 0 && (
        <div className="card text-center text-slate-400">No study materials found. Run the seed script to populate sample data.</div>
      )}
    </div>
  );
};

export default StudyMaterials;