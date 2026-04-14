const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, deleteSubscriber } = require('../controllers/subscriberController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { subscriberSchema } = require('../utils/zodSchemas');

// Public route for landing page
router.post('/', validate(subscriberSchema), subscribe);

// Admin only routes
router.get('/', protect, getSubscribers);
router.delete('/:id', protect, deleteSubscriber);

module.exports = router;
