const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard stats for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Convert Map to plain object for charts
    const aptitudeStats = Object.fromEntries(user.aptitudeStats || new Map());
    const codingStats = Object.fromEntries(user.codingStats || new Map());

    const calcAccuracy = (stats) => {
      let correct = 0, total = 0;
      Object.values(stats).forEach((s) => {
        correct += s.correct;
        total += s.total;
      });
      return total > 0 ? Math.round((correct / total) * 100) : 0;
    };

    res.json({
      quizzesAttempted: user.quizzesAttempted,
      codingProblemsSolved: user.codingProblemsSolved,
      mockTestsTaken: user.mockTestsTaken,
      streakCount: user.streakCount,
      skillScore: user.skillScore,
      aptitudeAccuracy: calcAccuracy(aptitudeStats),
      codingAccuracy: calcAccuracy(codingStats),
      aptitudeTopicWise: aptitudeStats,
      codingTopicWise: codingStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;