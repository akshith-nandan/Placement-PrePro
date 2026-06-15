const express = require('express');
const Company = require('../models/Company');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/companies
// @desc    List all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().select('name logoUrl cutoff');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/:name
// @desc    Get full company prep data
router.get('/:name', async (req, res) => {
  try {
    const company = await Company.findOne({ name: req.params.name });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/companies/:name/experience
// @desc    Add an interview experience (authenticated students)
router.post('/:name/experience', protect, async (req, res) => {
  try {
    const { role, rating, experience } = req.body;
    const company = await Company.findOne({ name: req.params.name });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.interviewExperiences.push({
      studentName: req.user.name,
      role,
      rating,
      experience
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;