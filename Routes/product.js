const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const {
  validateProduct,
  isLoggedIn,
  isSeller,
  isProductAuther,
  isVeryfiedSeller,
} = require("../middlewares/middleware");
const Review = require("../models/Review");
const User = require("../models/User");
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filesname = file.originalname.split(' ').join("_");
    return cb(null, uniqueSuffix + filesname)
  }
})

const upload = multer({ storage: storage })
router.get(
  "/product/:id/edit",
  isLoggedIn,
  isSeller,
  isVeryfiedSeller,
  isProductAuther,
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/home");
      }
      res.render("edit", { product });
    } catch (error) {
      console.error(error);
      req.flash("error", "Internal Server Error");
      res.redirect("/home");
    }
  }
);

router.get("/product/new", isLoggedIn, isSeller,isVeryfiedSeller, (req, res) => {
  res.render("new");
});

router.get("/home", async (req, res) => {
  try {
    const data = await Product.find({});
    return res.render("home", { data });
  } catch (error) {
    req.flash("error", `Internal Server Error: ${error}`);
    return res.redirect("/home");
  }
});

router.get("/product/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Product.findById(id).populate("reviews");
    if (!item) {
      req.flash("error", "Product not found");
      return res.redirect("/home");
    }
    res.render("show", { item });
  } catch (e) {
    req.flash("error", e.message);
    res.render("error", { err: e.message });
  }
});

router.patch(
  "/product/:id",
  isLoggedIn,
  isSeller,
  isVeryfiedSeller,
  isProductAuther,
  async (req, res) => {
    try {
      const { name, price, image, description } = req.body;
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, {
        name,
        price,
        image,
        description,
      });
      if (!updatedProduct) {
        req.flash("error", "Product not found");
        return res.redirect("/home");
      }
      req.flash("success", "Product Updated Successfully");
      res.redirect("/home");
    } catch (error) {
      console.error(error);
      req.flash("error", "Internal Server Error");
      res.redirect("/home");
    }
  }

);

router.post(
  "/products",
  isLoggedIn,
  isSeller,
  isVeryfiedSeller,
  validateProduct,
  async (req, res) => {
    try {
      const { name, price,image, description, quantity, isInStock, isInSaleItem, isPopularItem, isNewItem, category } = req.body;
      const requiredFields = { name, price, quantity, isInStock, isInSaleItem, isPopularItem, isNewItem, category,image };
      const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

      // if (missingFields.length > 0) {
      //   const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      //   req.flash("error", errorMsg);
      //   return res.render('error', { err: errorMsg });
      // }
        await Product.create({
          name,
          image,
          price,
          quantity,
          description,
          isInStock,
          isInSaleItem,
          isPopularItem,
          isNewItem,
          category: category[1],
          author: req.user._id,
        });
  
        req.flash("success", "Product Created Successfully");
        return res.redirect("/home");
    } catch (error) {
      console.error("Error creating product:", error);
      req.flash("error", "Internal Server Error");
      res.status(500).send("Internal Server Error");
    }
  }
);


router.delete(
  "/product/:id/delete",
  isLoggedIn,
  isSeller,
  isVeryfiedSeller,
  isProductAuther,
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/home");
      }

      for (let item of product.reviews) {
        await Review.findByIdAndDelete(item._id);
      }
      await Product.findByIdAndDelete(id);
      await User.updateMany({}, { $pull: { cart: { product: id } } });
      await User.updateMany({}, { $pull: { wishlist: id } });
      res.redirect("/home");
      
    } catch (error) {
      req.flash("error", "Internal Server Error", error);
      res.redirect("/home");
    }
  }
);



module.exports = router;
