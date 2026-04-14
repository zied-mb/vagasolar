require('dotenv').config();

// ─── Environment Variables Protection ─────────────────────────────────────────
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: Missing ${envVar} in .env file! Process shutting down.`);
    process.exit(1);
  }
}

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const hpp        = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const rateLimit  = require('express-rate-limit');
const morgan     = require('morgan');
const logger     = require('./utils/logger');
const connectDB  = require('./config/db');

// ─── Connect to MongoDB + Seed Admin ─────────────────────────────────────────
(async () => {
  await connectDB();

  // Auto-create admin if no user exists yet (or INITIAL_ADMIN_EMAIL is set)
  if (process.env.INITIAL_ADMIN_EMAIL && process.env.INITIAL_ADMIN_PASSWORD) {
    try {
      const User = require('./models/User');
      const exists = await User.findOne({ email: process.env.INITIAL_ADMIN_EMAIL });
      if (!exists) {
        await User.create({
          email:    process.env.INITIAL_ADMIN_EMAIL,
          password: process.env.INITIAL_ADMIN_PASSWORD,
          role:     'admin',
        });
        console.log(`✅ Admin seeded: ${process.env.INITIAL_ADMIN_EMAIL}`);
      }
    } catch (e) {
      console.error('⚠️  Admin seed failed:', e.message);
    }
  }
})();

const app = express();

// ─── Logging (Morgan via Winston) ─────────────────────────────────────────────
app.use(morgan('combined', { 
  stream: { write: message => logger.info(message.trim()) } 
}));

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── Strict CORS Whitelist ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Log the rejected CORS attempt as a warning
    if (origin) {
      logger.warn(`CORS Blocked direct attempt from origin: ${origin}`);
    }
    callback(new Error(`CORS policy blocked access from this origin.`));
  },
  credentials: true, // Required for httpOnly cookies
}));

// ─── Body Parsers & Advanced Sanitization ─────────────────────────────────────
// Strictly limit JSON body to 10kb to prevent DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

// Anti-Information Disclosure
app.disable('x-powered-by');

// Anti-Caching Middleware for API routes (Sensitive admin data should not be cached by browsers/ISPs)
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Prevent NoSQL injections
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         loginLimiter, require('./routes/authRoutes'));
app.use('/api/leads',        require('./routes/leadRoutes'));
app.use('/api/steg-rates',   require('./routes/stegRateRoutes'));
app.use('/api/projects',     require('./routes/projectRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/messages',     require('./routes/messageRoutes'));
app.use('/api/upload',       require('./routes/uploadRoutes'));
app.use('/api/subscribers',  require('./routes/subscriberRoutes'));
app.use('/api/stats',        require('./routes/statsRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  logger.warn(`404 Not Found - ${req.originalUrl} - IP: ${req.ip}`);
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err?.status || 500;
  const message = err?.message || 'Une erreur inattendue est survenue au niveau du serveur.';
  
  // Use Winston for errors
  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} \nStack: ${err?.stack}`);
  
  res.status(status).json({ 
    success: false, 
    message,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
  });
});

// ─── Start Server with Socket.IO ─────────────────────────────────────────────
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Pass io to express app to use in controllers
app.set('io', io);

io.on('connection', (socket) => {
  logger.info(`🔌 New socket connection: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`🔌 Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 VagaSolar API running on port ${PORT}`);
  logger.info(`   Environment : ${process.env.NODE_ENV}`);
  logger.info(`   CORS Origin : ${process.env.FRONTEND_URL}`);
  logger.info(`   Real-time   : Socket.IO initialized`);
});
