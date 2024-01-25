const express = require("express");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { validateReview,isLoggedIn } = require("../middlewares/middleware");
const router = express.Router();

router.post("/review/:id/new",isLoggedIn,validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const {id} = req.params;
    const product = await Product.findById(id);

    let review = new Review({rating, comment})
    product.reviews.push(review);

    await product.save();
    await review.save();
    req.flash('success','Review added sucesfully')
    res.redirect(`/product/${id}`)
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;