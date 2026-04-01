const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const codingRoutes = require('./routes/coding');
const materialsRoutes = require('./routes/materials');
const mockRoutes = require('./routes/mock');
const progressRoutes = require('./routes/progress');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = 5000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/quizzes', authenticateToken, quizRoutes);
app.use('/api/coding', authenticateToken, codingRoutes);
app.use('/api/materials', authenticateToken, materialsRoutes);
app.use('/api/mock', authenticateToken, mockRoutes);
app.use('/api/progress', authenticateToken, progressRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'PlacementPro API running' }));

app.listen(PORT, () => console.log(`🚀 PlacementPro API running on http://localhost:${PORT}`));