const Product = require('../Models/product.model');
const Category = require('../Models/category.model'); 
// Add a new product (Admin only)
exports.addProduct = async (req, res) => {
    try {
        const { name, description, category, subcategory, priceMRP, discountPrice, weightUnit, stockCount } = req.body;
        const images = req.files.map(file => file.path);

        const newProduct = new Product({
            name,
            description,
            images,
            category,
            subcategory,
            priceMRP,
            discountPrice,
            weightUnit,
            stockCount,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).populate('category');;
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};