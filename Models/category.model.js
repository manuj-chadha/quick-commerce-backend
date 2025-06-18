const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    iconBanner: { // URL for category icon/banner
        type: String,
        trim: true
    },
    subcategories: [ 
        {
            type: String,
            trim: true
        }
    ],
    displayOrder: { // For reordering categories for frontend display i.e, arranging order /priority order
        type: Number,
        default: 0
    }
}, {
    timestamps: true 
});


module.exports = mongoose.model('Category', categorySchema);

