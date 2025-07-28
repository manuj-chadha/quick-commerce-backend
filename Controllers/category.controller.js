const Category = require('../Models/category.model');

// Add a new category (Admin only)
exports.addCategory = async (req, res) => {
    try {
        const { name, description, subcategories, displayOrder } = req.body;
        const iconBanner = req.file ? req.file.path : null; // Get image path if uploaded

        const newCategory = new Category({
            name,
            description,
            iconBanner,
            subcategories: subcategories ? subcategories.split(',').map(s => s.trim()) : [], // Handle comma-separated subcategories
            displayOrder,
        });

        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ displayOrder: 'asc' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update a category (Admin only)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, subcategories, displayOrder } = req.body;
        const updateData = { name, description, displayOrder, subcategories: subcategories ? subcategories.split(',').map(s => s.trim()) : [] };

        if (req.file) {
            updateData.iconBanner = req.file.path;
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a category (Admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
