const express = require('express');
const { Joi } = require('express-validation');
const productCtrl = require('../controller/productController');
const { validate } = require('../helpers');

const paramValidation = {
  listProducts: {
    query: Joi.object({
      limit: Joi.string().required().default(25),
      page: Joi.string().required().min(1).default(1),
    })
  },
};

const router = express.Router();

/** GET /api/products
 *
 * Returns a list of products
 *
 **/
router.route('/')
  .get(validate(paramValidation.listProducts), productCtrl.listProducts)

module.exports = router;
