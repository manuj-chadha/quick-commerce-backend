const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  mergeGuestCart
} = require('../Controllers/cart.controller');
const { protect } = require('../Middlewares/auth.middleware');

const router = express.Router();

// Get & Add to cart
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.post('/merge', protect, mergeGuestCart);


// Update or remove specific item
router.route('/:productId')
  .patch(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
