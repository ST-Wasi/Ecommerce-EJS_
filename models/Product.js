
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  quantity: {
    type: Number,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  isNewItem: {
    type: Boolean,
    default: 'true'
  },
  isPopularItem: {
    type: Boolean,
    default: 'true'
  },
  isInSaleItem: {
    type: Boolean,
    default: 'true'
  },
  isInStock: {
    type: Boolean,
    default: 'true'
  },
  category: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
