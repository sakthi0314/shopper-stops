const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const wishlistSchema = new mongoose.Schema(
  {
    products: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Product',
      required: true,
      trim: true,
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

wishlistSchema.plugin(toJSON);
wishlistSchema.plugin(paginate);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
