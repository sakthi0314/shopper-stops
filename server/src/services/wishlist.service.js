const httpStatus = require('http-status');
const { Wishlist } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Counts number of documents of wishlist collection
 * @returns {Promise<Wishlist>}
 */
const countWishlist = async () => {
  return Wishlist.countDocuments();
};

/**
 * Create a wishlist
 * @param {Object} wishlistBody
 * @returns {Promise<Wishlist>}
 */
const createWishlist = async (wishlistBody) => {
  const { product, user } = wishlistBody;
  const wishlist = await Wishlist.findOne({ user });

  if (!wishlist) {
    const newWishlist = await Wishlist.create({ products: [product], user });
    return newWishlist;
  }

  // If wishlist by userId exists update the wishlist
  // 1. Check the product if it's already exists
  const isProductAlreadyExists = wishlist.products.includes(product);
  if (isProductAlreadyExists) throw new AppError('Product already placed in wish list', httpStatus.BAD_REQUEST);

  // 2. If product not found, update the wish list
  wishlist.products.unshift(product);
  await wishlist.save();

  return wishlist;
};

/**
 * Get wishlist by user id
 * @param {ObjectId} userId
 * @returns {Promise<Wishlist>}
 */
const getWishlistByUserId = async (userId) => {
  const productPopulateConfig = {
    path: 'products',
    select: 'name slug category price id stocks discount',
  };
  const wishlists = await Wishlist.findOne({ user: userId }).populate(productPopulateConfig);
  if (!wishlists) throw new AppError('Wishlists not found', httpStatus.NOT_FOUND);
  return wishlists;
};

/**
 * Delete wishlist by user id
 * @param {ObjectId} userId
 * @param {Object} requestBody
 * @returns {Promise<Wishlist>}
 */
const deleteWishlistByUserId = async (userId, requestBody) => {
  const { product } = requestBody;

  // Find wishlist with userId
  let wishlists = await Wishlist.findOne({ user: userId });
  if (!wishlists) throw new AppError('Wishlists not found.', httpStatus.NOT_FOUND);

  // Check the length of the wishlist.
  //  1. Delete the specific productId from products id's
  const deletingProductIndex = wishlists.products.findIndex((productId) => `${productId}` === product);

  if (deletingProductIndex === -1) throw new AppError('Product not found from the wish lists.', httpStatus.BAD_REQUEST);

  wishlists.products.splice(deletingProductIndex, 1);

  //  2. Check if the wishlist productIds length is >= 0 delete the entire wishlist or save the changes
  if (wishlists.products.length <= 0) wishlists = await Wishlist.findOneAndDelete({ user: userId });
  else await wishlists.save();

  return wishlists;
};

module.exports = {
  countWishlist,
  createWishlist,
  getWishlistByUserId,
  deleteWishlistByUserId,
};
