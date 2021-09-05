const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createWishlist = {
  body: Joi.object().keys({
    user: Joi.string().required().custom(objectId),
    product: Joi.string().required().custom(objectId),
  }),
};

const getWishlist = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const deleteWishlist = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    product: Joi.string().required().custom(objectId),
  }),
};

module.exports = { createWishlist, getWishlist, deleteWishlist };
