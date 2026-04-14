const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Validates JWT stored in httpOnly cookie.
 * Attaches req.user on success, returns 401 on failure.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Read from httpOnly cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    } 
    // 2. Read from Authorization header (Bearer <token>)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Veuillez vous connecter.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    // Strictly enforce Admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Rôle administrateur requis.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expirée. Reconnectez-vous.' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

module.exports = { protect };
