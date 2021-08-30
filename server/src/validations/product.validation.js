const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(), // .custom(objectId)
    price: Joi.number().required(),
    discount: Joi.number(),
    sizes: Joi.array().items(Joi.string().valid('XXL', 'XL', 'L', 'M', 'S')).required().max(5).min(1), // TODO: Sizes Need more refactor later
    stocks: Joi.number().required(),
  }),
};

const getAllProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: {
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string().custom(objectId),
    price: Joi.number(),
    discount: Joi.number(),
    sizes: Joi.array().items(Joi.string().valid('XXL', 'XL', 'L', 'M', 'S')).required().max(5).min(1), // TODO: Sizes Need more refactor later
    stocks: Joi.number(),
  },
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
