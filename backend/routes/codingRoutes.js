const express = require('express');
const CodingProblem = require('../models/CodingProblem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/coding/problems
// @desc    List problems with filters (difficulty, topic, company)
router.get('/problems', async (req, res) => {
  try {
    const { difficulty, topic, company } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;
    if (company) filter.companies = company;

    const problems = await CodingProblem.find(filter).select('title slug difficulty topic companies');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/coding/problems/:slug
// @desc    Get a single problem with starter code and visible test cases
router.get('/problems/:slug', async (req, res) => {
  try {
    const problem = await CodingProblem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);

    res.json({
      _id: problem._id,
      title: problem.title,
      slug: problem.slug,
      description: problem.description,
      difficulty: problem.difficulty,
      topic: problem.topic,
      companies: problem.companies,
      starterCode: problem.starterCode,
      testCases: visibleTestCases
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/coding/run
// @desc    Run code against visible test cases (no submission record)
// NOTE: integrate Judge0 or similar execution sandbox here in production
router.post('/run', protect, async (req, res) => {
  try {
    const { problemSlug, language, code } = req.body;
    const problem = await CodingProblem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Placeholder execution response - replace with real code execution service
    res.json({
      message: 'Code execution placeholder - connect Judge0 API in production',
      language,
      visibleTestCases: problem.testCases.filter((tc) => !tc.isHidden),
      output: 'Connect a code execution engine (e.g. Judge0) to see real output.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/coding/submit
// @desc    Submit final solution, run against all test cases, save submission
router.post('/submit', protect, async (req, res) => {
  try {
    const { problemSlug, language, code } = req.body;
    const problem = await CodingProblem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Placeholder: assume accepted (replace with real execution + comparison)
    const status = 'Accepted';

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      language,
      code,
      status,
      runtime: '0.02s',
      output: 'Connect execution engine for real results'
    });

    if (status === 'Accepted') {
      const user = await User.findById(req.user._id);

      // Avoid double counting if already solved
      const alreadySolved = await Submission.findOne({
        user: req.user._id,
        problem: problem._id,
        status: 'Accepted',
        _id: { $ne: submission._id }
      });

      if (!alreadySolved) {
        user.codingProblemsSolved += 1;
        user.skillScore = Math.min(100, user.skillScore + 3);
      }

      const statKey = problem.topic;
      const existing = user.codingStats.get(statKey) || { correct: 0, total: 0 };
      existing.correct += 1;
      existing.total += 1;
      user.codingStats.set(statKey, existing);

      user.updateStreak();
      await user.save();
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/coding/submissions
// @desc    Get logged-in user's submission history
router.get('/submissions', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;