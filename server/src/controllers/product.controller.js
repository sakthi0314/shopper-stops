const httpStatus = require('http-status');
const productService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const countProducts = catchAsync(async (req, res) => {
  const count = await productService.countProducts();

  res.status(httpStatus.OK).send(count);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'price', 'slug', 'discount', 'sizes', 'ratingsAverage']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);

  res.status(httpStatus.OK).send(product);
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const updateProduct = async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);

  res.status(httpStatus.OK).send(product);
};

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  countProducts,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
