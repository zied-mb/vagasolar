const Subscriber = require('../models/Subscriber');

// @desc    Add new subscriber
// @route   POST /api/subscribers
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requis' });
    }

    // Check for duplicate
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà inscrit' });
    }

    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      data: subscriber,
      message: 'Merci pour votre inscription !'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private/Admin
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Abonné non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Abonné supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
