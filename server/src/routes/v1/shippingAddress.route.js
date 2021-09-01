const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const shippingAddressValidation = require('../../validations/shippingAddress.validation');
const shippingAddressController = require('../../controllers/shippingAddress.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('manageShippingAddress'), shippingAddressController.getAllShippingAddress)
  .post(
    auth('crudShippingAddress'),
    validate(shippingAddressValidation.createShippingAddress),
    shippingAddressController.createShippingAddress
  );

router
  .route('/:userId')
  .get(auth('crudShippingAddress'), shippingAddressController.getShippingAddress)
  .patch(
    auth('crudShippingAddress'),
    validate(shippingAddressValidation.updateShippingAddress),
    shippingAddressController.updateShippingAddress
  )
  .delete(
    auth('crudShippingAddress', 'manageShippingAddress'),
    validate(shippingAddressValidation.deleteShippingAddress),
    shippingAddressController.deleteShippingAddress
  );

module.exports = router;

// TODO: Swagger Documentation required
