import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../utils/api';
import StatCard from '../components/StartCard';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#4F46E5', '#E2E8F0'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-slate-400">Loading dashboard...</p>;

  const aptitudeData = [
    { name: 'Accuracy', value: stats.aptitudeAccuracy },
    { name: 'Remaining', value: 100 - stats.aptitudeAccuracy }
  ];
  const codingData = [
    { name: 'Accuracy', value: stats.codingAccuracy },
    { name: 'Remaining', value: 100 - stats.codingAccuracy }
  ];

  const topicWiseData = Object.entries(stats.aptitudeTopicWise || {}).map(([topic, val]) => ({
    topic: topic.split(':')[1] || topic,
    accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">Here's how your placement preparation is going.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon="📝" label="Quizzes Attempted" value={stats.quizzesAttempted} color="indigo" />
        <StatCard icon="💻" label="Coding Problems Solved" value={stats.codingProblemsSolved} color="emerald" />
        <StatCard icon="📊" label="Mock Tests Taken" value={stats.mockTestsTaken} color="amber" />
        <StatCard icon="🔥" label="Streak" value={`${stats.streakCount} days`} color="red" />
        <StatCard icon="⭐" label="Skill Score" value={`${stats.skillScore}/100`} color="indigo" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Aptitude Accuracy</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={aptitudeData} dataKey="value" innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270}>
                {aptitudeData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-bold text-primary -mt-24">{stats.aptitudeAccuracy}%</p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Coding Accuracy</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={codingData} dataKey="value" innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270}>
                {codingData.map((entry, index) => (
                  <Cell key={index} fill={[COLORS[1], COLORS[0]][index % 2] === COLORS[0] ? '#10B981' : '#E2E8F0'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-bold text-secondary -mt-24">{stats.codingAccuracy}%</p>
        </div>
      </div>

      {/* Topic-wise performance */}
      <div className="card">
        <h3 className="font-semibold mb-4">Topic-wise Aptitude Performance</h3>
        {topicWiseData.length === 0 ? (
          <p className="text-slate-400 text-sm">Attempt some aptitude tests to see your topic-wise performance.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topicWiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" fontSize={12} />
              <YAxis domain={[0, 100]} fontSize={12} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;