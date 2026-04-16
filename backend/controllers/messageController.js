const xss     = require('xss');
const Message = require('../models/Message');

// ─── GET /api/messages (ADMIN) ───────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/messages (PUBLIC) ─────────────────────────────────────────────
exports.createMessage = async (req, res) => {
  try {
    // SECURITY — Field Whitelisting: Only extract explicitly allowed fields from
    // req.body. Any other keys (e.g. status, role, _id) are silently ignored,
    // preventing mass assignment / ID spoofing attacks.
    const { name, email, content, type } = req.body;

    // SECURITY — XSS Sanitization: Strip all HTML tags and script injection
    // patterns from user-supplied strings before persisting to MongoDB.
    const sanitizedPayload = {
      name:    xss(String(name    || '').trim()),
      email:   xss(String(email   || '').trim()),
      content: xss(String(content || '').trim()),
      type:    xss(String(type    || '').trim()),
    };

    const message = await Message.create(sanitizedPayload);

    // SECURITY — Emit exclusively to the 'admin' socket room so that PII
    // (name, email, message content) is never broadcast to public visitors.
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('new-message', {
        name:      message.name,
        email:     message.email,
        content:   message.content,
        type:      message.type,
        createdAt: message.createdAt,
      });
    }

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/messages/:id/read (ADMIN) ────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/messages/:id (ADMIN) ────────────────────────────────────────
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    res.status(200).json({ success: true, message: 'Message supprimé.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ─── POST /api/messages/bulk-delete (ADMIN) ──────────────────────────────────
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'IDs invalides.' });
    }
    await Message.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: `${ids.length} messages supprimés.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/messages/bulk-read (ADMIN) ────────────────────────────────────
exports.bulkRead = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'IDs invalides.' });
    }
    await Message.updateMany({ _id: { $in: ids } }, { status: 'Read' });
    res.status(200).json({ success: true, message: `${ids.length} messages marqués comme lus.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
