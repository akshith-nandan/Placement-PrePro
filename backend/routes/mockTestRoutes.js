const express = require('express');
const { MockTest, MockTestResult } = require('../models/MockTest');
const AptitudeQuestion = require('../models/ApptitudeQuestions');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/mocktests
// @desc    List available mock tests
router.get('/', async (req, res) => {
  try {
    const tests = await MockTest.find().select('title type durationMinutes');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/mocktests/:id/start
// @desc    Start a mock test - get questions (answers hidden)
router.get('/:id/start', protect, async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id)
      .populate({ path: 'aptitudeQuestions', select: '-correctOption -explanation' })
      .populate({ path: 'codingProblems', select: 'title slug difficulty topic' });

    if (!test) return res.status(404).json({ message: 'Mock test not found' });

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/mocktests/:id/submit
// @desc    Auto-submit/manual submit - calculate score, save result
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers, timeTakenSeconds } = req.body; // answers: [{ questionId, selectedOption }]
    const test = await MockTest.findById(req.params.id).populate('aptitudeQuestions');

    if (!test) return res.status(404).json({ message: 'Mock test not found' });

    let correctCount = 0, incorrectCount = 0, skippedCount = 0;
    const evaluatedAnswers = [];

    test.aptitudeQuestions.forEach((q) => {
      const ans = answers.find((a) => a.questionId === q._id.toString());
      if (!ans || ans.selectedOption === -1 || ans.selectedOption === undefined) {
        skippedCount++;
        evaluatedAnswers.push({ questionId: q._id, selectedOption: -1, isCorrect: false });
      } else {
        const isCorrect = q.correctOption === ans.selectedOption;
        if (isCorrect) correctCount++;
        else incorrectCount++;
        evaluatedAnswers.push({ questionId: q._id, selectedOption: ans.selectedOption, isCorrect });
      }
    });

    const totalMarks = test.aptitudeQuestions.length;
    const score = correctCount;

    const result = await MockTestResult.create({
      user: req.user._id,
      mockTest: test._id,
      score,
      totalMarks,
      correctCount,
      incorrectCount,
      skippedCount,
      timeTakenSeconds,
      answers: evaluatedAnswers
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.mockTestsTaken += 1;
    user.skillScore = Math.min(100, user.skillScore + 5);
    user.updateStreak();
    await user.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/mocktests/:id/leaderboard
// @desc    Top scorers for a mock test
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const results = await MockTestResult.find({ mockTest: req.params.id })
      .populate('user', 'name college')
      .sort({ score: -1, timeTakenSeconds: 1 })
      .limit(20);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/mocktests/results/me
// @desc    Get logged-in user's mock test history
router.get('/results/me', protect, async (req, res) => {
  try {
    const results = await MockTestResult.find({ user: req.user._id })
      .populate('mockTest', 'title type')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;