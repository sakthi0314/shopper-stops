const mongoose = require('mongoose');
const Product = require('./product.model');

const { toJSON, paginate } = require('./plugins');

const reviewSchema = new mongoose.Schema(
  {
    reviewTitle: {
      type: String,
      required: true,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true, // min and max are defined in the review.validation.js
    },
    product: {
      type: mongoose.Schema.ObjectId,
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

// Review index
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Populating only users name and photo
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Due to adding toJSON plugin the createdAt will be removed. So postedOn will be replaced by it by below.
reviewSchema.virtual('postedOn').get(function () {
  return this.createdAt;
});

/**
 * Calculates Average Rating of an review and updates the particuler product by the productId
 * @param {string} productId
 */
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

// reviewSchema.pre('remove', function (next) {
//   this.constructor.calcAverageRating(this.product);
//   next();
// });

// This was an hack that I used to provide data even to the post function when pre function passed.
// Bcoz we cant preform any other queries in post function
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRating(this.review.product);
});

/**
 *
 * @typedef Review
 */
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
