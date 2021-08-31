const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('manageReviews'), reviewController.getAllReviews)
  .post(auth('crudReviews'), validate(reviewValidation.createReview), reviewController.createReview);

router
  .route('/:reviewId')
  .get(auth('crudReviews'), reviewController.getReview)
  .delete(auth('crudReviews', 'manageReviews'), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;

// TODO: Swagger Documentation required
