const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../Controllers/cart.controller');
const { protect } = require('../Middlewares/auth.middleware');
const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart);
router.route('/:productId').delete(protect, removeFromCart);

module.exports = router;