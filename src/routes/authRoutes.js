const express = require('express');
const { Joi } = require('express-validation');
const authCtrl = require('../controller/authController');
const { validate } = require('../helpers');

const router = express.Router();
const paramValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  registerUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }),
  },
};

/** POST /api/auth/login
 *
 * Returns token and user details if correct username and password is provided
 *
 **/
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register
 *
 * Register a new user
 * Returns token and user details
 *
 **/
router.route('/register')
  .post(validate(paramValidation.registerUser), authCtrl.register);

module.exports = router;
