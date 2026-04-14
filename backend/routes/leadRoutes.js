const express = require('express');
const router  = express.Router();
const {
  createLead,
  getLeads,
  getLead,
  updateLeadStatus,
  markPdfDownloaded,
  exportLeads,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/',                createLead);       // POST /api/leads
router.patch('/:id/pdf',        markPdfDownloaded);// PATCH /api/leads/:id/pdf

// Admin-protected routes
router.get('/',                 protect, getLeads);      // GET  /api/leads
router.get('/export',           protect, exportLeads);   // GET  /api/leads/export
router.get('/:id',              protect, getLead);       // GET  /api/leads/:id
router.patch('/:id/status',     protect, updateLeadStatus); // PATCH /api/leads/:id/status

module.exports = router;
