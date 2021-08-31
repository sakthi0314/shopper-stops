const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    product: Joi.string().required(),
    user: Joi.string().required(),
    reviewTitle: Joi.string().required(),
    review: Joi.string().required().max(500),
    rating: Joi.number().min(1).max(5).required(),
  }),
};

const getAllReviews = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
};
