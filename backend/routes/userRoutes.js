const express = require('express');
const router = express.Router();
const { createAdmin, createAgent, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Allowed for both Super Admin and Admin (logic for filtering is in the controller)
router.get('/', authorize('superadmin', 'admin'), getUsers);

// Restricted to Super Admin
router.post('/create-admin', authorize('superadmin'), createAdmin);

// Restricted to Super Admin and Admin
router.post('/create-agent', authorize('superadmin', 'admin'), createAgent);

module.exports = router;
