const express = require('express');
const { addCategory, getCategories, updateCategory, deleteCategory } = require('../Controllers/category.controller');
const { protect, admin } = require('../Middlewares/auth.middleware');
const upload = require('../Utilities/cloudinary');
const router = express.Router();

// Public route to get all categories
router.route('/').get(getCategories);

// Admin routes
router.route('/').post(protect, admin, upload.single('iconBanner'), addCategory);
router.route('/:id').put(protect, admin, upload.single('iconBanner'), updateCategory).delete(protect, admin, deleteCategory);

module.exports = router;