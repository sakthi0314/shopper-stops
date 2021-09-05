const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const productRoute = require('./product.route');
const reviewRoute = require('./review.route');
const shippingAddressRoute = require('./shippingAddress.route');
const cartRoute = require('./cart.route');
const wishlistRoute = require('./wishlist.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/shipping-address',
    route: shippingAddressRoute,
  },
  {
    path: '/carts',
    route: cartRoute,
  },
  {
    path: '/wishlists',
    route: wishlistRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
