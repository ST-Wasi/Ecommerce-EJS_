const express = require("express");
const Product = require("../models/Product");
const { isLoggedIn } = require("../middlewares/middleware");
const User = require("../models/User");
const router = express.Router();
const stripe = require('stripe')('sk_test_51OaYE8SDey9MYA4smLWNGVqs1NIhoDOZk0MvW52f2pdcCIrnN0nEvp6y6TVy81WcF540cO6IgpFE8A4m0lClxtYn00WNR0lx6N')

router.post("/product/:id/cart", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const user = req.user;
    const existingCartItem = user.cart.find((item) => item.product.equals(product._id));
    if (!existingCartItem) {
      await User.findByIdAndUpdate(user._id, { $addToSet: { cart: { product: id, quantity: 1 } } });
      req.flash("success", "Product Added To Cart");
    } else {
      await User.updateOne(
        { _id: user._id, "cart.product": product._id },
        { $inc: { "cart.$.quantity": 1 } }
      );
      req.flash("success", "Product Already Added, Quantity Increased");
    }
    return res.redirect("/home");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error");
    return res.redirect("/home");
  }
});
router.get("/cart", isLoggedIn, async (req, res) => {
  const user = await req.user.populate("cart.product");
  const totalAmount = user.cart.reduce(
    (Accumulator, curr) => Accumulator + (curr.product.price*curr.quantity),
    0
  );
  res.render("cart", { user, totalAmount });
});
  
router.get('/checkout', async (req, res) => {
  try {
    const user = await req.user.populate('cart.product');
    const lineItems = user.cart.map((cartItem) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: cartItem.product.name,
        },
        unit_amount: cartItem.product.price * 100,
      },
      quantity: cartItem.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error generating checkout session');
    res.redirect('/cart');
  }
});
  
  router.post("/cart/:id/delete", async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndUpdate(req.user._id, { $pull: { cart: {product:id}} });
      req.flash("success", "Product Removed");
      res.redirect("/cart");
    } catch (error) {
      req.flash("error", "Error Occured While Removing");
      res.redirect("/cart");
    }
  });

module.exports = router;
