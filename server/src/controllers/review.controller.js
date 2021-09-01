const httpStatus = require('http-status');

const reviewService = require('../services/review.service');
const AppError = require('../utils/AppError');

const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const getAllReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'product', 'rating']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const reviews = await reviewService.queryReviews(filter, options);
  res.status(httpStatus.OK).send(reviews);
});

const getReview = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.reviewId);
  if (!review) throw new AppError('Review not found', httpStatus.NOT_FOUND);
  res.status(httpStatus.OK).send(review);
});

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).send(review);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.reviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { getAllReviews, getReview, createReview, deleteReview };
