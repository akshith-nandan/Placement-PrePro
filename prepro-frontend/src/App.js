import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AptitudeQuiz from './components/AptitudeQuiz';
import CodingProblems from './components/CodingProblems';
import StudyMaterials from './components/StudyMaterials';
import MockTests from './components/MockTests';
import Progress from './components/Progress';

const PAGES = {
  dashboard: Dashboard,
  aptitude: AptitudeQuiz,
  coding: CodingProblems,
  materials: StudyMaterials,
  mock: MockTests,
  progress: Progress,
};

function AppInner() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white' }}>P</div>
        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Loading PrepPro...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={activePage} onNav={setActivePage} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        <PageComponent onNav={setActivePage} key={activePage} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}