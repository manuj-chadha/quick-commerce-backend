const Cart = require('../Models/cart.model');
const Product = require('../Models/product.model');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ items: [], totalQuantity: 0, totalPrice: 0 });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (cart) {
            // Cart exists for user
            let itemIndex = cart.items.findIndex(p => p.product == productId);

            if (itemIndex > -1) {
                // Product exists in the cart, update the quantity
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            } else {
                // Product does not exists in cart, add new item
                cart.items.push({ product: productId, quantity, priceAtAddToCart: product.discountPrice || product.priceMRP, name: product.name });
            }
            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            // No cart for user, create new cart
            const newCart = await Cart.create({
                user: req.user.id,
                items: [{ product: productId, quantity, priceAtAddToCart: product.discountPrice || product.priceMRP, name: product.name }]
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne({ user: req.user.id });

        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.product == productId);

            if (itemIndex > -1) {
                cart.items.splice(itemIndex, 1);
                cart = await cart.save();
                return res.status(200).json(cart);
            }
        }
        res.status(404).json({ message: "Item not found in cart" });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};