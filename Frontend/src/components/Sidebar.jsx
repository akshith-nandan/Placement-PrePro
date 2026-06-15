import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/aptitude', label: 'Aptitude', icon: '🧮' },
  { to: '/coding', label: 'Coding Practice', icon: '💻' },
  { to: '/companies', label: 'Companies', icon: '🏢' },
  { to: '/mocktests', label: 'Mock Tests', icon: '📝' },
  { to: '/materials', label: 'Study Materials', icon: '📚' },
  { to: '/interview', label: 'Interview Prep', icon: '🎤' },
  { to: '/resume', label: 'Resume Builder', icon: '📄' },
  { to: '/profile', label: 'Profile', icon: '👤' }
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 py-6 px-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="text-2xl">🎯</span>
          <span className="text-lg font-bold text-primary">PlacementPro</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-indigo-50 text-primary' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex items-center gap-2 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-800 truncate w-32">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate w-32">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-sm text-red-500 hover:bg-red-50 rounded-lg px-3 py-2 text-left">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between px-1 py-2 z-50 overflow-x-auto">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-2 py-1 rounded-lg min-w-[60px] ${
                isActive ? 'text-primary' : 'text-slate-500'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;