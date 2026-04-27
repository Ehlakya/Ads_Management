const express = require('express');
const router = express.Router();
const { getQuotations, createQuotation } = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getQuotations);
router.post('/', createQuotation);

module.exports = router;
