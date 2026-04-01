const express = require('express');
const { getProgress, updateProgress, findUserById } = require('../data/store');
const router = express.Router();

router.get('/', (req, res) => {
  const progress = getProgress(req.user.id);
  const user = findUserById(req.user.id);
  if (!progress) return res.status(404).json({ error: 'Progress not found' });

  const companyReadiness = {
    'TCS': Math.min(100, Math.round(progress.quizAccuracy * 0.6 + progress.problemsSolved * 0.2)),
    'Infosys': Math.min(100, Math.round(progress.quizAccuracy * 0.55 + progress.problemsSolved * 0.18)),
    'Wipro': Math.min(100, Math.round(progress.quizAccuracy * 0.5 + progress.problemsSolved * 0.15)),
    'Cognizant': Math.min(100, Math.round(progress.quizAccuracy * 0.5 + progress.problemsSolved * 0.12)),
    'Accenture': Math.min(100, Math.round(progress.quizAccuracy * 0.45 + progress.problemsSolved * 0.1)),
    'Zoho': Math.min(100, Math.round(progress.problemsSolved * 0.4 + progress.quizAccuracy * 0.2)),
    'Amazon': Math.min(100, Math.round(progress.problemsSolved * 0.25 + progress.quizAccuracy * 0.15)),
    'Google': Math.min(100, Math.round(progress.problemsSolved * 0.18 + progress.quizAccuracy * 0.1)),
  };

  const skillMastery = {
    'Arrays & Strings': Math.min(100, Math.round(progress.problemsSolved * 0.8)),
    'Sorting & Searching': Math.min(100, Math.round(progress.problemsSolved * 0.6)),
    'Dynamic Programming': Math.min(100, Math.round(progress.problemsSolved * 0.35)),
    'Graph Algorithms': Math.min(100, Math.round(progress.problemsSolved * 0.3)),
    'Probability & Stats': Math.min(100, progress.quizAccuracy * 0.4),
    'System Design': Math.min(100, progress.totalStudyHours * 0.15),
  };

  const achievements = [
    { id: 1, name: 'First Blood', icon: '🏆', desc: 'Solved your first coding problem', unlocked: progress.problemsSolved >= 1 },
    { id: 2, name: 'Week Warrior', icon: '🔥', desc: 'Maintained a 7-day study streak', unlocked: progress.streak >= 7 },
    { id: 3, name: 'Speed Demon', icon: '⚡', desc: 'Completed a quiz with 90%+ accuracy', unlocked: (progress.quizHistory || []).some(h => h.score >= 90) },
    { id: 4, name: 'Centurion', icon: '💯', desc: 'Solved 100 coding problems', unlocked: progress.problemsSolved >= 100 },
    { id: 5, name: 'Sharpshooter', icon: '🎯', desc: 'Scored 90%+ in 5 consecutive quizzes', unlocked: false },
    { id: 6, name: 'Eagle Eye', icon: '🦅', desc: 'Completed all medium graph problems', unlocked: false },
    { id: 7, name: 'Mock Master', icon: '📋', desc: 'Completed 5 mock tests', unlocked: (progress.mockTestsDone || 0) >= 5 },
    { id: 8, name: 'Consistent', icon: '📅', desc: '14-day streak achieved', unlocked: progress.streak >= 14 },
  ];

  res.json({
    stats: {
      problemsSolved: progress.problemsSolved,
      totalProblems: 12,
      quizAccuracy: progress.quizAccuracy,
      streak: progress.streak,
      mockTestsDone: progress.mockTestsDone,
      totalStudyHours: progress.totalStudyHours,
      rank: progress.rank
    },
    companyReadiness,
    skillMastery,
    achievements,
    activityDays: progress.activityDays,
    quizHistory: (progress.quizHistory || []).slice(-10),
    mockHistory: (progress.mockHistory || []).slice(-10),
    user: user ? { name: user.name, college: user.college, branch: user.branch, year: user.year } : null
  });
});

router.post('/update-streak', (req, res) => {
  const progress = getProgress(req.user.id);
  if (!progress) return res.status(404).json({ error: 'Not found' });
  const today = new Date().toISOString().split('T')[0];
  const activityDays = { ...progress.activityDays, [today]: (progress.activityDays[today] || 0) + 1 };
  updateProgress(req.user.id, { activityDays, streak: progress.streak + 1 });
  res.json({ streak: progress.streak + 1 });
});

module.exports = router;