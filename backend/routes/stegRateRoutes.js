const express = require('express');
const router  = express.Router();
const { getRates, updateRates } = require('../controllers/stegRateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',  getRates);             // GET /api/steg-rates  (public)
router.put('/',  protect, updateRates); // PUT /api/steg-rates  (admin)

module.exports = router;
