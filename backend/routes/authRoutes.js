const express       = require('express');
const router        = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { protect }   = require('../middleware/authMiddleware');
const loginLimiter  = require('../middleware/loginLimiter');

// SECURITY: loginLimiter is applied ONLY to POST /login.
// logout and /me are never throttled, so the admin can always
// clear their session or check auth status regardless of attacker activity.
router.post('/login',  loginLimiter, login);  // POST /api/auth/login
router.post('/logout', logout);               // POST /api/auth/logout
router.get('/me',      protect, getMe);       // GET  /api/auth/me

module.exports = router;

