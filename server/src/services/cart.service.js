const httpStatus = require('http-status');
const { Cart } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Counts number of documents of cart collection
 * @returns {Promise<Cart>}
 */
const countCart = async () => {
  return Cart.countDocuments();
};

/**
 * Create a cart
 * @param {Object} cartBody
 * @returns {Promise<Cart>}
 */
const createCart = async (cartBody) => {
  const cart = await Cart.findOne({ user: cartBody.user });

  const { user, product, count, size } = cartBody;

  if (!cart) {
    const newCart = await Cart.create({ user, products: [{ product, count, size }] });
    return newCart;
  }

  // If cart by userId exists update the cart
  // 1. Check the product if it's already exists

  const existsProductIds = cart.products.map((item) => `${item.product}`);

  const isProductAlreadyExists = existsProductIds.includes(cartBody.product);

  if (isProductAlreadyExists) {
    throw new AppError('Product already placed in cart.', httpStatus.BAD_REQUEST);
  }

  // 2. If product not found, update the cart
  cart.products.unshift({ product, count, size });
  await cart.save();

  return cart;
};

/**
 * Get cart by user id
 * @param {ObjectId} userId
 * @returns {Promise<Cart>}
 */
const getCartByUserId = async (userId) => {
  const productPopulateConfig = {
    path: 'products',
    populate: {
      path: 'product',
      select: 'name slug category price id stocks discount',
    },
  };
  const cart = await Cart.findOne({ user: userId }).populate(productPopulateConfig);
  if (!cart) throw new AppError('No Cart found', httpStatus.NOT_FOUND);
  return cart;
};

/**
 * Update cart by user id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Cart>}
 */
const updateCartByUserId = async (userId, updateBody) => {
  const cart = await Cart.findOne({ user: userId });

  // If not response with error code
  if (!cart) {
    throw new AppError('Cart not found', httpStatus.NOT_FOUND);
  }

  // Update the cart by the details
  const updatingProductIndex = cart.products.findIndex((item) => `${item.product}` === updateBody.product);

  if (updatingProductIndex === -1) throw new AppError('Product not found in cart', httpStatus.NOT_FOUND);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(updateBody)) {
    cart.products[updatingProductIndex][key] = value;
  }

  await cart.save();
  return cart;
};

/**
 * Delete cart by id
 * @param {ObjectId} userId
 * @param {Object} requestBody
 * @returns {Promise<Cart>}
 */
const deleteCartByUserId = async (userId, requestBody) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError('There is no cart found.', httpStatus.NOT_FOUND);

  //  1. Delete the specific productId from productIds
  const deletingProductIndex = cart.products.findIndex((item) => `${item.product}` === requestBody.product);

  if (deletingProductIndex === -1) throw new AppError('Product not found in cart.', httpStatus.NOT_FOUND);
  else cart.products.splice(deletingProductIndex, 1);

  //  2. Check if the cart products length is >= 0 delete the entire cart or save the changes
  if (cart.products.length <= 0) cart = await Cart.findOneAndDelete({ user: userId });
  else await cart.save();

  return cart;
};

module.exports = {
  countCart,
  createCart,
  getCartByUserId,
  updateCartByUserId,
  deleteCartByUserId,
};
