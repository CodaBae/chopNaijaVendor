const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  },

  cart: {
    type: [Object],
  },
  billing: {
    type: [Object],
  },
  shipping: {
    type: [Object],
  },

  date: {
    type: Date,
    default: Date.now
  },

});

const User = mongoose.model('User', UserSchema);

module.exports = User;
