const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCart = {
  body: Joi.object().keys({
    user: Joi.string().required().custom(objectId),
    product: Joi.string().required().custom(objectId),
    count: Joi.number(),
    size: Joi.array().items(Joi.string().valid('XXL', 'XL', 'L', 'M', 'S')).required().max(5).min(1), // TODO: Sizes Need more refactor later,
  }),
};

const getCart = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const updateCart = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    product: Joi.string().required().custom(objectId),
    count: Joi.number(),
    size: Joi.array().items(Joi.string().valid('XXL', 'XL', 'L', 'M', 'S')).max(5).min(1), // TODO: Sizes Need more refactor later,
  }),
};

const deleteCart = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    product: Joi.string().required().custom(objectId),
  }),
};

module.exports = { createCart, getCart, updateCart, deleteCart };
