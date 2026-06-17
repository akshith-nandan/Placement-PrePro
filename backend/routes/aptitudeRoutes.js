const express = require('express');
const AptitudeQuestion = require('../models/ApptitudeQuestions');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/aptitude/categories
// @desc    List all categories with topic counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await AptitudeQuestion.aggregate([
      {
        $group: {
          _id: { category: '$category', topic: '$topic' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          topics: { $push: { topic: '$_id.topic', count: '$count' } }
        }
      }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/aptitude/test
// @desc    Get a set of questions for a topic/category to start a timed test
// @query   category, topic, limit, difficulty
router.get('/test', protect, async (req, res) => {
  try {
    const { category, topic, limit = 20, difficulty } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await AptitudeQuestion.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } },
      { $project: { correctOption: 0, explanation: 0 } } // hide answers during test
    ]);

    res.json({ questions, timerMinutes: Math.max(10, Math.ceil(questions.length)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/aptitude/submit
// @desc    Submit answers, get instant results + explanations, update stats
router.post('/submit', protect, async (req, res) => {
  try {
    const { answers, category, topic } = req.body; // answers: [{ questionId, selectedOption }]

    const questionIds = answers.map((a) => a.questionId);
    const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });

    let correctCount = 0;
    const results = answers.map((a) => {
      const q = questions.find((q) => q._id.toString() === a.questionId);
      const isCorrect = q && q.correctOption === a.selectedOption;
      if (isCorrect) correctCount++;
      return {
        questionId: a.questionId,
        selectedOption: a.selectedOption,
        correctOption: q ? q.correctOption : null,
        isCorrect,
        explanation: q ? q.explanation : ''
      };
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.quizzesAttempted += 1;

    const statKey = `${category}:${topic}`;
    const existing = user.aptitudeStats.get(statKey) || { correct: 0, total: 0 };
    existing.correct += correctCount;
    existing.total += answers.length;
    user.aptitudeStats.set(statKey, existing);

    // Simple skill score bump
    user.skillScore = Math.min(100, user.skillScore + Math.round((correctCount / answers.length) * 5));
    user.updateStreak();

    await user.save();

    res.json({
      score: correctCount,
      total: answers.length,
      percentage: Math.round((correctCount / answers.length) * 100),
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;