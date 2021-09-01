const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const AppError = require('../utils/AppError');

const shippingAddressService = require('../services/shippingAddress.service');

exports.getAllShippingAddress = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const shippingAddresses = await shippingAddressService.queryShippingAddress(filter, options);
  res.status(httpStatus.OK).send(shippingAddresses);
});

exports.getShippingAddress = catchAsync(async (req, res) => {
  const shippingAddress = await shippingAddressService.getShippingAddressByUserId(req.params.userId);

  if (!shippingAddress) throw new AppError('There is no shipping address found.', httpStatus.NOT_FOUND);

  res.status(httpStatus.OK).send(shippingAddress);
});

exports.createShippingAddress = catchAsync(async (req, res) => {
  const shippingAddress = await shippingAddressService.createShippingAddress(req.body);
  res.status(httpStatus.CREATED).send(shippingAddress);
});

exports.updateShippingAddress = catchAsync(async (req, res) => {
  const shippingAddress = await shippingAddressService.updateShippingAddressById(req.params.userId, req.body);
  res.status(httpStatus.ACCEPTED).send(shippingAddress);
});

exports.deleteShippingAddress = catchAsync(async (req, res) => {
  await shippingAddressService.deleteShippingAddressById(req.params.userId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});
