const asyncLib = require('async');
const Products = require('../models/products');

/**
 * Get a list of products.
 *
 * @param {ClientRequest} req - The http request object
 * @param {OutgoingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @returns {Product[]}
 */
function listProducts(req, res, next) {
  const {page, limit} = req.query;
  let pageNumber = Number(page);
  if (pageNumber <= 0) {
    pageNumber = 1;
  }
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  asyncLib.parallel({
    count: asyncLib.apply(_getProductCount),
    list: asyncLib.apply(_getProductList, skip, limitNumber)
  }).then((result) => {
    return res.json({
      productList: result.list,
      count: result.count
    });
  }).catch((error) => {
    return next(error);
  });
}

/**
 * Get a list of products.
 *
 * @param {function} callback - The callback used to pass control to the next action
 *
 * @returns {count<number>}
 */
function _getProductCount(callback) {
  Products.countDocuments()
    .then((count) => {
      return callback(null, count);
    });
}

/**
 * Get a list of products.
 *
 * @param {number} skip - The number of items to skip
 * @param {number} limit - The number of items to return
 * @param {function} callback - The callback used to pass control to the next action
 *
 * @returns {Products[]}
 */
function _getProductList(skip, limit, callback) {
  Products.find()
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .exec()
    .then((products) => {
      return callback(null, products);
    });
}

module.exports = {listProducts};
