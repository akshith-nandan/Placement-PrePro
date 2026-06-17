const express = require('express');
const InterviewQuestion = require('../models/InterviewQuestion');

const router = express.Router();

// @route   GET /api/interview
// @desc    Get interview questions filtered by type (Technical/HR) and subject
router.get('/', async (req, res) => {
  try {
    const { type, subject } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (subject) filter.subject = subject;

    const questions = await InterviewQuestion.find(filter);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;