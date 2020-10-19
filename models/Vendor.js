const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  brand_name: {
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
  productNum: {
    type: Number,
  },
  orderNum: {
    type: Number,
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  products: {
    type: [Object],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },

});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;
