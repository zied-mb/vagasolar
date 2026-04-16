const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: sign JWT and attach to httpOnly cookie ───────────────────────────
// SECURITY: SameSite=None + Secure=true is required for cross-site deployments
// (e.g., Netlify frontend → Render backend). The httpOnly flag prevents all
// JavaScript access, mitigating XSS-based token theft completely.
const sendTokenCookie = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  res.cookie('token', token, {
    httpOnly: true,            // JS cannot read this cookie (XSS protection)
    secure:   true,            // Must be HTTPS (required for SameSite=None)
    sameSite: 'none',          // Required for cross-site Netlify → Render cookies
    maxAge:   8 * 60 * 60 * 1000, // 8 hours in milliseconds
  });

  res.status(statusCode).json({
    success: true,
    user: { id: user._id, email: user.email, role: user.role },
  });
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const GENERIC_ERROR = 'Identifiants incorrects.';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: GENERIC_ERROR });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: GENERIC_ERROR });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: GENERIC_ERROR });

    sendTokenCookie(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// SECURITY: Must use identical SameSite/Secure flags as login to ensure the
// browser actually clears the cookie on cross-site requests.
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure:   true,
    sameSite: 'none',
    expires:  new Date(0),
  });
  res.status(200).json({ success: true, message: 'Déconnexion réussie.' });
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
