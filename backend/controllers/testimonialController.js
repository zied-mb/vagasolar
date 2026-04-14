const Testimonial = require('../models/Testimonial');
const { cloudinary } = require('../middleware/upload');

// ─── Helper: extract Cloudinary public_id from a full URL ────────────────────
// URL format: https://res.cloudinary.com/{cloud}/image/upload/v{ver}/{public_id}.{ext}
// Splitting on '/upload/' then stripping the version prefix and file extension
// gives the exact public_id regardless of which folder the image was stored in.
const extractPublicId = (url) => {
  try {
    const afterUpload = url.split('/upload/')[1];            // "v1234567890/vagasolar/projects/abc.webp"
    const withoutVersion = afterUpload.replace(/^v\d+\//, ''); // "vagasolar/projects/abc.webp"
    return withoutVersion.replace(/\.[^/.]+$/, '');            // "vagasolar/projects/abc"
  } catch {
    return null;
  }
};

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

    // Delete the avatar from Cloudinary before removing the DB record
    if (t.image && t.image.includes('cloudinary.com')) {
      const publicId = extractPublicId(t.image);
      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          if (result.result !== 'ok' && result.result !== 'not found') {
            console.warn(`[CLOUDINARY] Unexpected destroy result for "${publicId}":`, result.result);
          }
        } catch (cloudErr) {
          // Non-fatal: log and continue — the DB record must still be removed
          console.warn('[CLOUDINARY] Delete failed:', cloudErr.message);
        }
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Témoignage supprimé.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
