const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number'] 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['customer', 'admin'], // Users can be either 'customer' or 'admin'
        default: 'customer'
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address' // Reference to the Address model
        }
    ],
    walletBalance: { // Optional Wallet feature
        type: Number,
        default: 0
    },
    wishlisted:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Product'
    }]
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);

