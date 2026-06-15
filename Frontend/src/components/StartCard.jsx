import React from 'react';

const StatCard = ({ icon, label, value, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-primary',
    emerald: 'bg-emerald-50 text-secondary',
    amber: 'bg-amber-50 text-accent',
    red: 'bg-red-50 text-danger'
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;