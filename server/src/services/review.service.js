const httpStatus = require('http-status');
const { Review } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Counts number of documents of reviews collection
 * @returns {Promise<Product>}
 */
const countReviews = async () => {
  return Review.countDocuments();
};

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  const user = await Review.findOne({ user: reviewBody.user });

  // Check if user already posted review on a same product
  if (user) {
    throw new AppError('Users are allowed only once for a review of a product!', httpStatus.BAD_REQUEST);
  }
  // else create a new review
  return Review.create(reviewBody);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  // const productPopulateConfig = {
  //   path: 'product',
  //   select: 'name slug category images',
  // };
  // TODO: Need to populate the product
  const review = await Review.paginate(filter, options);
  return review;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getReviewById = async (id) => {
  return Review.findById(id);
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Product>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new AppError('Review not found', httpStatus.NOT_FOUND);
  }
  await review.remove();
  return review;
};

module.exports = { countReviews, createReview, queryReviews, deleteReviewById, getReviewById };
