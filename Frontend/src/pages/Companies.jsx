import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const companyEmoji = {
  TCS: '🔵',
  Infosys: '🟣',
  Wipro: '🟢',
  Accenture: '🟠',
  Cognizant: '🔷'
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/companies');
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) return <p className="text-slate-400">Loading companies...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Company-Wise Preparation</h1>
      <p className="text-slate-500 mb-6">Explore hiring patterns, previous questions, and interview experiences.</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {companies.map((c) => (
          <Link key={c._id} to={`/companies/${c.name}`} className="card hover:shadow-md transition flex items-center gap-3">
            <span className="text-3xl">{companyEmoji[c.name] || '🏢'}</span>
            <div>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-xs text-slate-400">Cutoff: {c.cutoff || 'N/A'}</p>
            </div>
          </Link>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="card text-center text-slate-400">No companies found. Run the seed script to populate sample data.</div>
      )}
    </div>
  );
};

export default Companies;