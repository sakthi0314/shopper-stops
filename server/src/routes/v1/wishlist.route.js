const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const wishlistValidation = require('../../validations/wishlist.validation');
const wishlistController = require('../../controllers/wishlist.controller');

const router = express.Router();

router.route('/').post(auth('crudWishlist'), validate(wishlistValidation.createWishlist), wishlistController.createWishlist);

router
  .route('/:userId')
  .get(auth('crudWishlist'), validate(wishlistValidation.getWishlist), wishlistController.getWishList)
  .delete(auth('crudWishlist'), validate(wishlistValidation.deleteWishlist), wishlistController.deleteWishList);

module.exports = router;

// TODO: Swagger Documentation required
