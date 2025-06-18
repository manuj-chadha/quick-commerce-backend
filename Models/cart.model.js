const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 
    },
    priceAtAddToCart: { 
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

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
        unique: true // Each user can only have one active cart
    },
    items: [cartItemSchema], 
    totalQuantity: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true 
});

// Middleware to update totalQuantity and totalPrice before saving
cartSchema.pre('save', function(next) {
    this.totalQuantity = this.items.reduce((acc, item) => acc + item.quantity, 0);
    this.totalPrice = this.items.reduce((acc, item) => acc + (item.quantity * item.priceAtAddToCart), 0);
    next();
});



module.exports = mongoose.model('Cart', cartSchema);

