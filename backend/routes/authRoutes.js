const express = require('express');
const router  = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login',  login);          // POST /api/auth/login
router.post('/logout', logout);         // POST /api/auth/logout
router.get('/me',      protect, getMe); // GET  /api/auth/me

module.exports = router;
