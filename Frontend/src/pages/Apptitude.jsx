import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const categoryIcons = {
  Quantitative: '🧮',
  'Logical Reasoning': '🧠',
  'Verbal Ability': '🗣️',
  'Data Interpretation': '📊'
};

const Aptitude = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('Easy');
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/aptitude/categories');
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const startTest = (category, topic) => {
    navigate(`/aptitude/test?category=${encodeURIComponent(category)}&topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&limit=${limit}`);
  };

  if (loading) return <p className="text-slate-400">Loading categories...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Aptitude Preparation</h1>
      <p className="text-slate-500 mb-6">Choose a category and topic to start a timed practice test.</p>

      <div className="card mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Questions</label>
          <select className="input-field" value={limit} onChange={(e) => setLimit(e.target.value)}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{categoryIcons[cat._id] || '📘'}</span>
              <h3 className="text-lg font-semibold">{cat._id}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.topics.map((t) => (
                <button
                  key={t.topic}
                  onClick={() => startTest(cat._id, t.topic)}
                  className="text-sm bg-slate-100 hover:bg-indigo-50 hover:text-primary px-3 py-1.5 rounded-lg transition"
                >
                  {t.topic} ({t.count})
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="card text-center text-slate-400">
          No aptitude questions found. Run the seed script to populate sample data.
        </div>
      )}
    </div>
  );
};

export default Aptitude;