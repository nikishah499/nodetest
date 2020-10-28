const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const _ = require('lodash');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const config = require('../config');

/**
 * Method to login
 * Returns jwt token and user details if valid email and password are provided
 *
 * @param {ClientRequest} req - The http request object
 * @param {OutgoingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @returns {token, User}
 */
function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (_.isEmpty(user)) {
        throw new APIError('User does not exists!', httpStatus.NOT_FOUND);
      }
      if (!user.validPassword(password)) {
        const err = new APIError('User email and password combination do not match', httpStatus.UNAUTHORIZED);
        return next(err);
      }
      const token = _generateJWT(user.safeModel());
      return res.json({
        token,
        user: user.safeModel(),
      });
    })
    .catch((err) => next(err));
}

/**
 * Method to register a new user
 * Returns jwt token and newly created user details
 *
 * @param {ClientRequest} req - The http request object
 * @param {OutgoingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @returns {token, User}
 */
function register(req, res, next) {
  const user = new User(req.body);

  User.findOne({ email: req.body.email })
    .exec()
    .then((foundUser) => {
      if (foundUser) {
        throw new APIError('Email address already is use', httpStatus.CONFLICT);
      }
      user.password = user.generatePassword(req.body.password);
      return user.save();
    })
    .then((savedUser) => {
      const token = _generateJWT(savedUser.safeModel());
      return res.json({
        token,
        user: savedUser.safeModel(),
      });
    })
    .catch((err) => next(err));
}

/**
 * Generates JWT for the payload
 *
 * @param {Object} payload - Payload to be signed in JWT
 *
 * @returns JWT token
 */
function _generateJWT(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
  });
}

module.exports = { login, register };
