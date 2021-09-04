const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const cartValidation = require('../../validations/cart.validation');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();

router.route('/').post(auth('crudCart'), validate(cartValidation.createCart), cartController.createCart);

router
  .route('/:userId')
  .get(auth('crudCart'), validate(cartValidation.getCart), cartController.getCarts)
  .patch(auth('crudCart'), validate(cartValidation.updateCart), cartController.updateCart)
  .delete(auth('crudCart'), validate(cartValidation.deleteCart), cartController.deleteCart);

module.exports = router;

// TODO: Swagger Documentation required
