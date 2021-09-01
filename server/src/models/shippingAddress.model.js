const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const shippingAddressModelLayer = new mongoose.Schema({
  addressLineOne: {
    type: String,
    required: true,
    trim: true,
  },
  addressLineTwo: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  town: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  defaultShippingAddress: {
    type: Boolean,
    default: false,
  },
});

shippingAddressModelLayer.plugin(toJSON);

const shippingAddressModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  },
  shippingAddress: {
    type: [shippingAddressModelLayer],
    required: true,
  },
});

shippingAddressModel.plugin(toJSON);
shippingAddressModel.plugin(paginate);

shippingAddressModel.index({ userId: 1 });

/**
 *
 * @typedef ShippingAddress
 */
const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressModel);

module.exports = ShippingAddress;
