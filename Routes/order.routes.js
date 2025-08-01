const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderByStripeSession,
  getAllOrders,
  getOrderStats,
  getRecentOrders
} = require('../Controllers/orders.controller');
const { protect, admin } = require('../Middlewares/auth.middleware');

// Get orders for logged-in user
router.get('/my-orders', protect, getMyOrders);
router.get('/stripe-session/:sessionId', protect, getOrderByStripeSession);
router.get('/admin/orders', protect, admin, getAllOrders);

router.get('/admin/stats', protect, admin, getOrderStats);
router.get('/admin/recent-orders', protect, admin, getRecentOrders);



module.exports = router;
