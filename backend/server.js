const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      throw err;
    });
};

// Import Routes
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const matchRoutes = require('./routes/matches');
const newsRoutes = require('./routes/news');
const standingsRoutes = require('./routes/standings');
const exportRoutes = require('./routes/export');
const aiRoutes = require('./routes/ai');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/standings', standingsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/ai', aiRoutes);

// Home Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Basketball Management API',
    version: '3.0.0',
    endpoints: {
      auth: '/api/auth',
      teams: '/api/teams',
      players: '/api/players',
      matches: '/api/matches',
      news: '/api/news',
      standings: '/api/standings',
      export: '/api/export',
      ai: '/api/ai'
    }
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5001;
let server;

// Start Server
if (require.main === module) {
  connectDB()
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📍 API URL: http://localhost:${PORT}`);
      });
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = { app, server, connectDB };
