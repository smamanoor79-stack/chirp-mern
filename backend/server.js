require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();

// connect to MongoDB
connectDB();

// CORS: allow only the deployed frontend (and localhost for dev).
// Set FRONTEND_URL in your environment (e.g. https://chirp.vercel.app)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // Vite dev server
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, mobile apps, health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' })); // raised limit since post/avatar images are sent as base64

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 404 handler for unknown API routes only
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all: any other route serves the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Chirp API running on port ${PORT}`));