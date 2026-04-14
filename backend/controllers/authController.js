const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: sign JWT and attach to httpOnly cookie ───────────────────────────
const sendTokenCookie = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure:   isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge:   8 * 60 * 60 * 1000, // 8 hours
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
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires:  new Date(0),
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Déconnexion réussie.' });
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
