const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      // Array of image URLs
      {
        type: String,
        required: true, // At least one image is required
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: "General",
    },
    priceMRP: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      // Custom validation to ensure discountPrice is less than or equal to priceMRP
      validate: {
        validator: function (v) {
          return v <= this.priceMRP;
        },
        message: (props) => `${props.value} must be less than or equal to MRP!`,
      },
    },
    weightUnit: {
      type: {
        value: {
          type: Number,
          min: 0,
        },
        unit: {
          type: String,
          enum: ["g", "kg", "ml", "Ltr", "pcs", "bunch"],
        },
      },
      required: false,
    },
    stockCount: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
