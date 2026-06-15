const express = require('express');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Simple ATS scoring heuristic based on content completeness and keyword presence
const calculateATSScore = (resume) => {
  let score = 0;

  if (resume.personalInfo?.fullName) score += 5;
  if (resume.personalInfo?.email) score += 5;
  if (resume.personalInfo?.phone) score += 5;
  if (resume.personalInfo?.summary && resume.personalInfo.summary.length > 50) score += 10;

  if (resume.education?.length > 0) score += 15;

  if (resume.projects?.length > 0) {
    score += Math.min(20, resume.projects.length * 10);
  }

  if (resume.skills?.length >= 5) score += 20;
  else score += resume.skills.length * 3;

  if (resume.certifications?.length > 0) score += Math.min(10, resume.certifications.length * 5);

  return Math.min(100, score);
};

// @route   GET /api/resume
// @desc    Get logged-in user's resume (create empty if none exists)
router.get('/', protect, async (req, res) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      resume = await Resume.create({ user: req.user._id });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/resume
// @desc    Update resume sections and recalculate ATS score
router.put('/', protect, async (req, res) => {
  try {
    const { template, personalInfo, education, projects, skills, certifications } = req.body;

    let resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      resume = new Resume({ user: req.user._id });
    }

    if (template !== undefined) resume.template = template;
    if (personalInfo !== undefined) resume.personalInfo = { ...resume.personalInfo, ...personalInfo };
    if (education !== undefined) resume.education = education;
    if (projects !== undefined) resume.projects = projects;
    if (skills !== undefined) resume.skills = skills;
    if (certifications !== undefined) resume.certifications = certifications;

    resume.atsScore = calculateATSScore(resume);

    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;