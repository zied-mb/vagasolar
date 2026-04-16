const rateLimit = require('express-rate-limit');
const logger    = require('../utils/logger');

// ─── Safe-listed IPs ──────────────────────────────────────────────────────────
// Add your own static IP to ADMIN_SAFELIST_IPS in .env to never be rate-limited.
// Format: comma-separated list, e.g. ADMIN_SAFELIST_IPS=41.226.10.5,197.30.0.1
const _safelistIPs = (process.env.ADMIN_SAFELIST_IPS || '')
  .split(',')
  .map(ip => ip.trim())
  .filter(Boolean);

// ─── Login Rate Limiter ───────────────────────────────────────────────────────
// Applied ONLY to POST /api/auth/login — not to logout or /me.
//
// Key security properties:
//  • skipSuccessfulRequests: true  — a correct password NEVER consumes a slot.
//    An attacker being blocked on 10 wrong attempts will NOT lock out a legitimate
//    admin who logs in with valid credentials from a different or same IP.
//  • skip()                       — safe-listed IPs are completely bypassed.
//  • handler()                    — returns `retryAfter` (seconds) so the
//    frontend can display a precise live countdown instead of a static message.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window per IP
  max: 10,                   // max 10 FAILED attempts per IP per window
  skipSuccessfulRequests: true,
  skip: (req) => _safelistIPs.includes(req.ip),
  standardHeaders: true,     // sets RateLimit-* response headers
  legacyHeaders:  false,
  handler: (req, res) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
    logger.warn(
      `🔐 Login brute-force blocked — IP: ${req.ip} — ` +
      `${req.rateLimit.used}/${req.rateLimit.limit} attempts`
    );
    res.status(429).json({
      success:    false,
      message:    `Trop de tentatives depuis votre adresse IP. Réessayez dans ${Math.ceil(retryAfter / 60)} min.`,
      retryAfter, // seconds — read by the frontend countdown timer
    });
  },
});

module.exports = loginLimiter;
