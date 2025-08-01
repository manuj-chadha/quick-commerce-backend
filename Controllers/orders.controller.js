const Stripe = require('stripe');
const Order = require('../Models/order.model.js'); // adjust path
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createStripeOrder = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate line items with discounted prices for Stripe
    const line_items = cartItems.map(item => {
      const discountPercent = item.product.discountPrice || 0;
      const discountedPrice = item.product.priceMRP - (item.product.priceMRP * discountPercent / 100);

      return {
        price_data: {
          currency: 'inr',
          product_data: { name: item.product.name },
          unit_amount: Math.round(discountedPrice * 100), // Stripe expects amount in paisa
        },
        quantity: item.quantity
      };
    });

    const productTotal = cartItems.reduce((acc, item) => {
      return acc + item.product.priceMRP * item.quantity;
    }, 0);

    const discount = cartItems.reduce((acc, item) => {
      const percent = item.product.discountPrice || 0;
      return acc + ((item.product.priceMRP * percent / 100) * item.quantity);
    }, 0);

    const finalTotal = productTotal - discount + 30; // Add deliveryCharges (flat ₹30)

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // Save order in DB
    const order = await Order.create({
      user: userId,
      deliveryAddress,
      paymentMethod: 'Credit/Debit Card',
      items: cartItems.map(item => {
        const percent = item.product.discountPrice || 0;
        const discountedPrice = item.product.priceMRP - (item.product.priceMRP * percent / 100);

        return {
          product: item.product._id,
          quantity: item.quantity,
          priceAtOrder: discountedPrice,
          name: item.product.name
        };
      }),
      productTotal,
      discount,
      finalTotal,
      stripeSessionId: session.id,
      paymentStatus: 'pending'
    });

    res.status(200).json({ sessionId: session.id });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};


exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'Confirmed'; // could move to "Packed" later
        order.invoiceUrl = session.invoice_pdf || null;
        await order.save();
      }
    } catch (err) {
      console.error('Order update failed:', err.message);
    }
  }

  res.status(200).send('Received');
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Fetch orders failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrderByStripeSession = async (req, res) => {
  try {
    const order = await Order.findOne({ stripeSessionId: req.params.sessionId }).populate('items.product');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//admin side

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // get user info
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Admin fetch orders failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name');

    res.status(200).json(orders);
  } catch (err) {
    console.error('Failed to fetch recent orders:', err);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.productTotal-order.discount || 0), 0);

    res.status(200).json({ totalOrders, totalRevenue });
  } catch (err) {
    console.error('Failed to get order stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

