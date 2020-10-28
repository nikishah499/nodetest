const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Methods
 */
UserSchema.method({
  generatePassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
  safeModel() {
    return _.omit(this.toObject(), ['password', '__v']);
  },
});

/**
 * User model
 *
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
