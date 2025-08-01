const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtOrder: { 
        type: Number,
        required: true,
        min: 0
    },
    name: { 
        type: String,
        required: true
    }
}, {
    _id: false 
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User 
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryAddress: {
        contactName: { type: String, required: true },
        contactPhone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'Credit/Debit Card'],
        required: true
    },
    items: [orderItemSchema],
    productTotal: { 
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    deliveryCharges: {
        type: Number,
        default: 30,
        min: 0
    },
    finalTotal: { 
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Confirmed'
    },
    invoiceUrl: { 
        type: String,
        trim: true
    },
    stripeSessionId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }

}, {
    timestamps: true
});


module.exports = mongoose.model('Order', orderSchema);

