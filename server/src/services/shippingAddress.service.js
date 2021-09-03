const httpStatus = require('http-status');
const { ShippingAddress } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Counts number of documents of shipping address collection
 * @returns {Promise<ShippingAddress>}
 */
const countShippingAddress = async () => {
  return ShippingAddress.countDocuments();
};

/**
 * Create a shipping address
 * @param {Object} shippingAddressBody
 * @returns {Promise<ShippingAddress>}
 */
const createShippingAddress = async (shippingAddressBody) => {
  const userShippingAddress = await ShippingAddress.findOne({ user: shippingAddressBody.user });

  if (!userShippingAddress) {
    return ShippingAddress.create(shippingAddressBody);
  }

  if (shippingAddressBody.shippingAddress.defaultShippingAddress) {
    userShippingAddress.shippingAddress.forEach((address) => {
      // eslint-disable-next-line no-param-reassign
      address.defaultShippingAddress = false;
    });
  }

  userShippingAddress.shippingAddress.unshift(shippingAddressBody.shippingAddress);

  await userShippingAddress.save({ new: true });
  return userShippingAddress;
};

/**
 * Query for shipping address
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryShippingAddress = async (filter, options) => {
  const shippingAddress = await ShippingAddress.paginate(filter, options);
  return shippingAddress;
};

/**
 * Get shipping address by id
 * @param {ObjectId} userId
 * @returns {Promise<ShippingAddress>}
 */
const getShippingAddressByUserId = async (userId) => {
  return ShippingAddress.findOne({ user: userId });
};

/**
 * Update shipping address by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<ShippingAddress>}
 */
const updateShippingAddressByUserId = async (userId, updateBody) => {
  const userShippingAddress = await getShippingAddressByUserId(userId);

  if (!userShippingAddress) {
    throw new AppError('No shipping address found', httpStatus.NOT_FOUND);
  }

  const updatingAddressIndex = userShippingAddress.shippingAddress.findIndex((address) => {
    return `${address._id}` === updateBody.id;
  });

  if (updatingAddressIndex === -1) {
    throw new AppError('Shipping address not found.', httpStatus.BAD_REQUEST);
  }

  userShippingAddress.shippingAddress.forEach((address) => {
    if (updateBody.defaultShippingAddress === true) {
      // Make the default address as false
      // eslint-disable-next-line no-param-reassign
      address.defaultShippingAddress = false;
    }

    if (`${address._id}` === updateBody.id) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(updateBody)) {
        // eslint-disable-next-line no-param-reassign
        address[key] = value;
      }
    }
  });

  await userShippingAddress.save();

  return userShippingAddress;
};

/**
 * Delete shipping address by id
 * @param {ObjectId} userId
 * @param {Object} requestBody
 * @returns {Promise<Product>}
 */
const deleteShippingAddressByUserId = async (userId, requestBody) => {
  let userShippingAddress = await getShippingAddressByUserId(userId);

  if (!userShippingAddress) return new AppError('No shipping address found.', httpStatus.NOT_FOUND);

  // Check the length of the userShippingAddress.
  //  1. Delete the specific productId from productIds

  const deletingAddressIndex = userShippingAddress.shippingAddress.findIndex(
    (address) => `${address._id}` === requestBody.id
  );

  if (deletingAddressIndex === -1) {
    throw new AppError('Shipping address not found from the list.', httpStatus.BAD_REQUEST);
  }

  userShippingAddress.shippingAddress.splice(deletingAddressIndex, 1);

  if (userShippingAddress.shippingAddress.length > 0) {
    userShippingAddress.shippingAddress[0].defaultShippingAddress = true;
  }

  //  2. Check if the cart products length is >= 0 delete the entire cart or save the changes
  if (userShippingAddress.shippingAddress.length <= 0) {
    userShippingAddress = await ShippingAddress.findOneAndDelete({ user: userId });
  } else {
    await userShippingAddress.save();
  }

  return userShippingAddress;
};

module.exports = {
  countShippingAddress,
  createShippingAddress,
  queryShippingAddress,
  getShippingAddressByUserId,
  updateShippingAddressByUserId,
  deleteShippingAddressByUserId,
};
