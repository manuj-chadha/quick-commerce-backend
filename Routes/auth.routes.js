const express = require('express');
const { signup, signin, getAllCustomers } = require('../Controllers/user.controller');
const { protect, admin } = require('../Middlewares/auth.middleware');

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/signin', signin);

// Admin-only Route
router.get('/admin/customers', protect, admin, getAllCustomers);


module.exports = router;
