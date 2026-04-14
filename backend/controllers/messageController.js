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
    const message = await Message.create(req.body);
    
    // Emit real-time notification to all connected clients (especially the admin)
    const io = req.app.get('io');
    if (io) {
      io.emit('new-message', {
        name:    message.name,
        email:   message.email,
        content: message.content,
        type:    message.type,
        createdAt: message.createdAt
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
