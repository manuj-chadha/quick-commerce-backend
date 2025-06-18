const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: { // Reference to the User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactName: {
        type: String,
        required: true,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{6}$/, 'Please fill a valid 6-digit pincode'] 
    },
    addressType: { 
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    isDefault: { 
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Address', addressSchema);

