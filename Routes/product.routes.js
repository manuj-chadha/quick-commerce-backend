const express = require('express');
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/product.controller');
const { protect, admin } = require('../Middlewares/auth.middleware');
const upload = require('../Utilities/cloudinary');
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.array('images', 5), addProduct);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;