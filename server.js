const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/db');
const logger = require('./src/middlewares/logger.middleware');
const errorHandler = require('./src/middlewares/error.middleware');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─────────────────────────────────────────
// 🔒 SECURITY MIDDLEWARE
// ─────────────────────────────────────────
app.use(helmet()); // sets secure HTTP headers

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 🚦 Rate limiting — max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// ─────────────────────────────────────────
// 📝 LOGGING MIDDLEWARE
// ─────────────────────────────────────────
app.use(morgan('dev'));   // third-party logger
app.use(logger);          // custom colored logger

// ─────────────────────────────────────────
// 📦 BODY PARSING
// ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// 🛣️ ROUTES
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 User Management API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ─────────────────────────────────────────
// ❓ 404 HANDLER
// ─────────────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found.`,
  });
});

// ─────────────────────────────────────────
// ❌ GLOBAL ERROR HANDLER (must be last!)
// ─────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────
// 🚀 START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}\n`);
});
