const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} = require('../Controllers/cart.controller');
const { protect } = require('../Middlewares/auth.middleware');

const router = express.Router();

// Get & Add to cart
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

// Update or remove specific item
router.route('/:productId')
  .patch(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
