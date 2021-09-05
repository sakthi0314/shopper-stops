const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const wishlistService = require('../services/wishlist.service');

const getWishList = catchAsync(async (req, res) => {
  const wishlists = await wishlistService.getWishlistByUserId(req.params.userId);
  res.status(httpStatus.OK).send(wishlists);
});

const createWishlist = catchAsync(async (req, res) => {
  const wishlists = await wishlistService.createWishlist(req.body);
  res.status(httpStatus.ACCEPTED).send(wishlists);
});

const deleteWishList = catchAsync(async (req, res) => {
  await wishlistService.deleteWishlistByUserId(req.params.userId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getWishList,
  createWishlist,
  deleteWishList,
};
