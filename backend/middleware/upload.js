const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

/**
 * Cloudinary Configuration
 * Directly using process.env or failing silently with a warning
 */
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
  console.warn('\n[WARNING] Cloudinary credentials missing in .env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verification Log
console.log('[CLOUDINARY_INIT]', {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key:   process.env.CLOUDINARY_API_KEY ? `***${process.env.CLOUDINARY_API_KEY.slice(-4)}` : 'MISSING',
});

/**
 * Robust Multer Storage
 * We use a static path detection based on the field name to ensure stability
 * across different request lifecycles.
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Detect folder based on field name or simple heuristics
    // This is more reliable than req.baseUrl in multi-middleware setups
    let folder = 'vagasolar/general';
    
    if (file.fieldname === 'images' || file.fieldname === 'image') {
      folder = 'vagasolar/projects';
    } else if (file.fieldname === 'testimonial') {
      folder = 'vagasolar/testimonials';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
      ],
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { cloudinary, upload };
