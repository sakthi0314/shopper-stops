const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createShippingAddress = {
  body: Joi.object().keys({
    user: Joi.string().required().custom(objectId),
    shippingAddress: Joi.object({
      addressLineOne: Joi.string().required(),
      addressLineTwo: Joi.string(),
      district: Joi.string().required(),
      town: Joi.string().required(),
      city: Joi.string().required(),
      pincode: Joi.number().required(),
      defaultShippingAddress: Joi.boolean(),
    }),
  }),
};

const getAllShippingAddress = {
  query: Joi.object().keys({
    user: Joi.string(),
    shippingAddress: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getShippingAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateShippingAddress = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object({
    id: Joi.string(),
    addressLineOne: Joi.string(),
    addressLineTwo: Joi.string(),
    district: Joi.string(),
    town: Joi.string(),
    city: Joi.string(),
    pincode: Joi.number(),
    defaultShippingAddress: Joi.boolean(),
  }),
};

const deleteShippingAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: {
    id: Joi.string().required(),
  },
};

module.exports = {
  createShippingAddress,
  getAllShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
