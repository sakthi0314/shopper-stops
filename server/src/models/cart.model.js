const mongoose = require('mongoose');

const toJSON = require('./plugins/toJSON.plugin');

// DOCS: PRODUCT_REQUIRED_SIZES = ['XXL', 'XL', 'L', 'M', 'S'];

// cart => products : sub document model
const cartProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  size: {
    type: [String],
    required: true,
  },
});

cartProductSchema.plugin(toJSON);

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [cartProductSchema],
      required: true,
      default: () => ({}),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

cartSchema.plugin(toJSON);

/**
 * @typedef Cart
 */
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
