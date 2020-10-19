const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  delivery: {
    type: String,
    required: true
  },
  img: {
    type: [Object],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },

});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
