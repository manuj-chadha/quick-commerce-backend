const express = require('express');
const router = express.Router();
const { createStripeOrder, handleStripeWebhook } = require('../Controllers/orders.controller.js');
const { protect } = require('../Middlewares/auth.middleware');

// Called from frontend
router.post('/create-stripe-session', protect, createStripeOrder);

// Called by Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
