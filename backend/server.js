require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aptitudeRoutes = require('./routes/aptitudeRoutes');
const codingRoutes = require('./routes/codingRoutes');
const companyRoutes = require('./routes/companyRoutes');
const mockTestRoutes = require('./routes/mockTestRoutes');
const materialRoutes = require('./routes/materialRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Middleware
app.use( cors({
    origin: "*",
  }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/mocktests', mockTestRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume', resumeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PlacementPro API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`PlacementPro server running on port ${PORT}`));