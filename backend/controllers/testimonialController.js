const Testimonial = require('../models/Testimonial');
const { cloudinary } = require('../middleware/upload');

// ─── GET /api/testimonials  (PUBLIC) ─────────────────────────────────────────
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true, isApproved: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/testimonials/all  (ADMIN) ──────────────────────────────────────
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/testimonials  (PUBLIC/ADMIN) ──────────────────────────────────
exports.createTestimonial = async (req, res) => {
  try {
    // Note: Frontend will handle if it's an admin or public submission
    // Public submissions will have isApproved: false by default (schema default)
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/testimonials/:id  (ADMIN) ──────────────────────────────────────
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Témoignage introuvable.' });
    res.status(200).json({ success: true, testimonial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/testimonials/:id  (ADMIN) ───────────────────────────────────
exports.deleteTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Témoignage introuvable.' });

    // Extract public_id from Cloudinary URL if exists
    if (t.image && typeof t.image === 'string' && t.image.includes('cloudinary.com')) {
      try {
        const parts = t.image.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const publicId = `vagasolar/testimonials/${filename}`; 
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.warn('Cloudinary Delete Failed:', cloudErr.message);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Témoignage supprimé.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
