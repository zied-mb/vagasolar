const express = require('express');
const router  = express.Router();
const {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { testimonialSchema } = require('../utils/zodSchemas');

router.get('/',        getTestimonials);               // GET  /api/testimonials
router.get('/all',     protect, getAllTestimonials);    // GET  /api/testimonials/all  (admin)
router.post('/',       validate(testimonialSchema), createTestimonial); // POST /api/testimonials (Public, Validated)
router.put('/:id',     protect, updateTestimonial);    // PUT  /api/testimonials/:id
router.delete('/:id',  protect, deleteTestimonial);    // DEL  /api/testimonials/:id

module.exports = router;
