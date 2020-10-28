const express = require('express');
const expressJwt = require('express-jwt');
const config = require('../config');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');

const router = express.Router();

/** GET /health-check
 *
 * Route to check that service is running fine
 **/
router.get('/health-check', (req, res) => res.send('Server health is good!'));

// mount authentication routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs for jwt token.
router.use(expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  resultProperty: 'locals.session',
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    if (req.headers.token) {
      return req.headers.token;
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
}));

// mount book routes at /products
router.use('/products', productRoutes);

module.exports = router;
