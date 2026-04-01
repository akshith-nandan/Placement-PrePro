const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with DB in production)
const users = [
  {
    id: 'demo-user-1',
    name: 'Arjun Sharma',
    email: 'arjun@example.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    college: 'NIT Trichy',
    branch: 'CSE',
    year: 'Final Year',
    joinedAt: new Date('2024-01-15')
  }
];

const userProgress = {
  'demo-user-1': {
    problemsSolved: 142,
    quizAccuracy: 78,
    streak: 14,
    mockTestsDone: 8,
    totalStudyHours: 186,
    rank: 234,
    solvedProblems: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    quizHistory: [],
    mockHistory: [],
    activityDays: generateActivityDays()
  }
};

function generateActivityDays() {
  const days = {};
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const rand = Math.random();
    days[key] = rand > 0.4 ? Math.floor(rand * 5) : 0;
  }
  return days;
}

const createUser = (name, email, passwordHash, college) => {
  const user = { id: uuidv4(), name, email, passwordHash, college, branch: 'CSE', year: 'Final Year', joinedAt: new Date() };
  users.push(user);
  userProgress[user.id] = {
    problemsSolved: 0, quizAccuracy: 0, streak: 0, mockTestsDone: 0,
    totalStudyHours: 0, rank: 999, solvedProblems: [], quizHistory: [], mockHistory: [],
    activityDays: generateActivityDays()
  };
  return user;
};

const findUserByEmail = (email) => users.find(u => u.email === email);
const findUserById = (id) => users.find(u => u.id === id);
const getProgress = (userId) => userProgress[userId];
const updateProgress = (userId, updates) => {
  if (!userProgress[userId]) userProgress[userId] = {};
  Object.assign(userProgress[userId], updates);
};

module.exports = { users, userProgress, createUser, findUserByEmail, findUserById, getProgress, updateProgress };