const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../data/store');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (findUserByEmail(email)) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser(name, email, passwordHash, college || 'Not specified');
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, college: user.college, branch: user.branch, year: user.year } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, college: user.college, branch: user.branch, year: user.year } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Demo login
router.post('/demo', async (req, res) => {
  const user = findUserByEmail('arjun@example.com');
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, college: user.college, branch: user.branch, year: user.year } });
});

module.exports = router;