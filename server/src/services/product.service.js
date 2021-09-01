const httpStatus = require('http-status');
const slugify = require('slugify');
const { Product } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Counts number of documents of products collection
 * @returns {Promise<Product>}
 */
const countProducts = async () => {
  return Product.countDocuments();
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const slug = slugify(productBody.name, { lower: true, strict: true });
  if (await Product.isProductNameTaken(slug)) {
    throw new AppError('Product name is already taken.', httpStatus.BAD_REQUEST);
  }

  return Product.create({ ...productBody, slug });
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id).populate('reviews');
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const slug = slugify(updateBody.name, { lower: true, strict: true });

  if (await Product.isProductNameTaken(slug)) {
    throw new AppError('Product name is already taken.', httpStatus.BAD_REQUEST);
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { ...updateBody, slug },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new AppError('No product found', httpStatus.NOT_FOUND);
  }

  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new AppError('Product not found', httpStatus.NOT_FOUND);
  }
  await product.remove();
  return product;
};

module.exports = {
  countProducts,
  createProduct,
  getProductById,
  queryProducts,
  updateProductById,
  deleteProductById,
};
