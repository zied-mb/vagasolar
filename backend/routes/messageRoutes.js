const express = require('express');
const router = express.Router();
const { getMessages, createMessage, markAsRead, deleteMessage, bulkDelete, bulkRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMessages)
  .post(createMessage); // Public

router.post('/bulk-delete', protect, bulkDelete);
router.patch('/bulk-read',   protect, bulkRead);

router.route('/:id')
  .delete(protect, deleteMessage);

router.patch('/:id/read', protect, markAsRead);

module.exports = router;
