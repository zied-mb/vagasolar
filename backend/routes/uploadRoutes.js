const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

/**
 * Helper to handle Multer errors and return clean JSON
 */
const handleUpload = (field, isMultiple = false) => {
  const middleware = isMultiple ? upload.array(field, 10) : upload.single(field);
  
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) {
        console.error(`[UPLOAD_ERROR] (${field}):`, err);
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur lors du téléchargement vers Cloudinary.',
          error: err.message || JSON.stringify(err)
        });
      }
      next();
    });
  };
};

/**
 * @route   POST /api/upload
 * @desc    Upload a single image (Admin)
 */
router.post('/', protect, handleUpload('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Fichier manquant.' });
  res.status(200).json({ success: true, url: req.file.path, public_id: req.file.filename });
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images for Project Gallery (Admin)
 */
router.post('/multiple', protect, handleUpload('images', true), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });
  }

  const files = req.files.map(f => ({
    url: f.path,
    public_id: f.filename
  }));

  res.status(200).json({ success: true, files });
});

/**
 * @route   POST /api/upload/public
 * @desc    External upload for Testimonials
 */
router.post('/public', handleUpload('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Fichier manquant.' });
  res.status(200).json({ success: true, url: req.file.path });
});

/**
 * @route   POST /api/upload/cleanup-images
 * @desc    Batch delete images from Cloudinary (Admin)
 */
router.post('/cleanup-images', protect, async (req, res) => {
  const { publicIds } = req.body;
  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Aucun ID public fourni.' });
  }

  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('[CLEANUP_ERROR]', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
