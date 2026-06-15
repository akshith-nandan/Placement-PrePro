const express = require('express');
const StudyMaterial = require('../models/StudyMaterial');

const router = express.Router();

// @route   GET /api/materials
// @desc    List study materials, filter by category and search by topic
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const materials = await StudyMaterial.find(filter).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;