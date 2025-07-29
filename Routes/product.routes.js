const express = require('express');
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../Controllers/product.controller');
const { protect, admin } = require('../Middlewares/auth.middleware');
const upload = require('../Utilities/cloudinary');
const router = express.Router();

// GET all, POST new product
router
  .route('/')
  .get(getProducts)
  .post(protect, admin, upload.array('images', 5), addProduct);

// GET single, UPDATE, DELETE product
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.array('images', 5), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
