const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const cartService = require('../services/cart.service');

const getCarts = catchAsync(async (req, res) => {
  const carts = await cartService.getCartByUserId(req.params.userId);
  res.status(httpStatus.OK).send(carts);
});

const createCart = catchAsync(async (req, res) => {
  const cart = await cartService.createCart(req.body);
  res.status(httpStatus.ACCEPTED).send(cart);
});

const updateCart = catchAsync(async (req, res) => {
  const cart = await cartService.updateCartByUserId(req.params.userId, req.body);
  res.status(httpStatus.ACCEPTED).send(cart);
});

const deleteCart = catchAsync(async (req, res) => {
  await cartService.deleteCartByUserId(req.params.userId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
};
