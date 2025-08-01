const Cart = require('../Models/cart.model');
const Product = require('../Models/product.model');

// GET /cart - Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({ items: [], totalQuantity: 0, totalPrice: 0 });
    }

    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + (item.priceAtAddToCart || 0) * item.quantity,
      0
    );

    res.status(200).json({ items: cart.items, totalQuantity, totalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// POST /cart - Add item to cart (or increment if exists)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          priceAtAddToCart: Math.round(
            product.priceMRP - (product.priceMRP * (product.discountPrice || 0) / 100)
          ),

          name: product.name,
        });
      }

      cart = await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: req.user.id,
        items: [{
          product: productId,
          quantity,
          priceAtAddToCart: product.discountPrice || product.priceMRP,
          name: product.name,
        }],
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /cart/:productId - Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const index = cart.items.findIndex(i => i.product.toString() === productId);
    if (index === -1) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items[index].quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /cart/:productId - Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      const index = cart.items.findIndex(p => p.product.toString() === productId);
      if (index > -1) {
        cart.items.splice(index, 1);
        await cart.save();
        return res.status(200).json(cart);
      }
    }

    res.status(404).json({ message: 'Item not found in cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /cart - Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
