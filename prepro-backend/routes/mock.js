const express = require('express');
const { getProgress, updateProgress } = require('../data/store');
const router = express.Router();

const mockTests = [
  {
    id: 1, name: "TCS NQT 2025", company: "TCS", icon: "🔵",
    sections: ["Cognitive Ability", "Programming Logic", "Technical"],
    duration: 180, totalQuestions: 90,
    description: "Full simulation of TCS National Qualifier Test with all three sections.",
    questions: [
      { id: 1, section: "Cognitive", q: "If 15% of x = 20% of y, then x:y = ?", opts: ["3:4", "4:3", "2:3", "3:2"], ans: 1 },
      { id: 2, section: "Cognitive", q: "Find the missing number: 1, 4, 9, 16, ?, 36", opts: ["20", "25", "24", "30"], ans: 1 },
      { id: 3, section: "Technical", q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], ans: 1 },
      { id: 4, section: "Technical", q: "Which data structure follows LIFO?", opts: ["Queue", "Array", "Stack", "Linked List"], ans: 2 },
      { id: 5, section: "Programming", q: "What does SQL SELECT DISTINCT do?", opts: ["Sorts rows", "Returns unique rows", "Deletes duplicates", "Counts rows"], ans: 1 }
    ]
  },
  {
    id: 2, name: "Infosys InfyTQ", company: "Infosys", icon: "🟣",
    sections: ["Aptitude", "Verbal", "Coding"],
    duration: 120, totalQuestions: 65,
    description: "Comprehensive Infosys placement test covering all key areas.",
    questions: [
      { id: 1, section: "Aptitude", q: "A and B can complete a work in 6 and 12 days respectively. In how many days will they finish together?", opts: ["3", "4", "5", "6"], ans: 1 },
      { id: 2, section: "Verbal", q: "Choose the synonym of ELOQUENT:", opts: ["Silent", "Articulate", "Confused", "Timid"], ans: 1 },
      { id: 3, section: "Coding", q: "Output of: print(type(1/2)) in Python 3?", opts: ["int", "float", "double", "number"], ans: 1 },
      { id: 4, section: "Aptitude", q: "A car covers 100km at 50 kmph and next 100km at 100 kmph. Average speed?", opts: ["75 kmph", "66.67 kmph", "80 kmph", "70 kmph"], ans: 1 },
      { id: 5, section: "Verbal", q: "Identify the correct sentence:", opts: ["She don't know", "She doesn't knows", "She doesn't know", "She not know"], ans: 2 }
    ]
  },
  {
    id: 3, name: "Wipro WILP", company: "Wipro", icon: "🟠",
    sections: ["Aptitude", "Coding", "Communication"],
    duration: 90, totalQuestions: 55,
    description: "Wipro Work Integrated Learning Program entrance test.",
    questions: [
      { id: 1, section: "Aptitude", q: "What is 15% of 240?", opts: ["36", "30", "42", "24"], ans: 0 },
      { id: 2, section: "Coding", q: "Which sorting algorithm has best average case O(n log n)?", opts: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], ans: 2 },
      { id: 3, section: "Communication", q: "What does 'defer' mean?", opts: ["Agree", "Postpone", "Accept", "Reject"], ans: 1 }
    ]
  }
];

router.get('/', (req, res) => {
  const progress = getProgress(req.user.id);
  const history = progress ? (progress.mockHistory || []) : [];
  const result = mockTests.map(t => {
    const taken = history.find(h => h.testId === t.id);
    return { id: t.id, name: t.name, company: t.company, icon: t.icon, sections: t.sections, duration: t.duration, totalQuestions: t.totalQuestions, description: t.description, bestScore: taken ? taken.score : null, attempts: history.filter(h => h.testId === t.id).length };
  });
  res.json(result);
});

router.get('/:id', (req, res) => {
  const test = mockTests.find(t => t.id === parseInt(req.params.id));
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json(test);
});

router.post('/:id/submit', (req, res) => {
  const test = mockTests.find(t => t.id === parseInt(req.params.id));
  if (!test) return res.status(404).json({ error: 'Test not found' });
  const { answers, timeTaken } = req.body;

  let correct = 0;
  const results = test.questions.map(q => {
    const userAns = answers && answers[q.id] !== undefined ? answers[q.id] : -1;
    const isCorrect = userAns === q.ans;
    if (isCorrect) correct++;
    return { id: q.id, correct: isCorrect, correctAnswer: q.ans, userAnswer: userAns };
  });

  const score = Math.round((correct / test.questions.length) * 100);
  const progress = getProgress(req.user.id);
  if (progress) {
    const newHistory = [...(progress.mockHistory || []), { testId: test.id, testName: test.name, score, correct, total: test.questions.length, timeTaken, date: new Date() }];
    const bestScores = mockTests.map(t => { const best = newHistory.filter(h => h.testId === t.id); return best.length ? Math.max(...best.map(h => h.score)) : 0; });
    updateProgress(req.user.id, { mockHistory: newHistory, mockTestsDone: newHistory.length });
  }

  res.json({ score, correct, total: test.questions.length, results, message: score >= 70 ? '🎉 Great performance!' : score >= 50 ? '👍 Good effort, keep practicing!' : '📚 Review the topics and try again.' });
});

module.exports = router;