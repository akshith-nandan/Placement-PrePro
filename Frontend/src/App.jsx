import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Aptitude from './pages/Apptitude';
import AptitudeTest from './pages/ApptitudeTest';
import Coding from './pages/Coding';
import CodingProblem from './pages/CodingProblem';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import MockTests from './pages/MockTests';
import MockTestAttempt from './pages/MockTestAttempt';
import StudyMaterials from './pages/StudyMaterials';
import InterviewPrep from './pages/InterviewPrep';
import ResumeBuilder from './pages/ResumeBuilder';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
      <Route path="/aptitude/test" element={<ProtectedRoute><AptitudeTest /></ProtectedRoute>} />

      <Route path="/coding" element={<ProtectedRoute><Coding /></ProtectedRoute>} />
      <Route path="/coding/:slug" element={<ProtectedRoute><CodingProblem /></ProtectedRoute>} />

      <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
      <Route path="/companies/:name" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />

      <Route path="/mocktests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
      <Route path="/mocktests/:id" element={<ProtectedRoute><MockTestAttempt /></ProtectedRoute>} />

      <Route path="/materials" element={<ProtectedRoute><StudyMaterials /></ProtectedRoute>} />
      <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-10 text-center text-slate-400">404 - Page not found</div>} />
    </Routes>
  );
}

export default App;