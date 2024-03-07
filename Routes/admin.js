const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn, isBlocked } = require("../middlewares/middleware");
const User = require("../models/User");
const Product = require("../models/Product");
const nodemailer = require('nodemailer');

router.get(
  "/admin/dashboard",
  isLoggedIn,
  isBlocked,
  isAdmin,
  async (req, res) => {
    const users = await User.find({});
    res.render("admin/adminDashboard", { users });
  }
);

router.post(
  "/admin/:id/seller/verify",
  isLoggedIn,
  isBlocked,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      user.isVeryfiedSeller = !user.isVeryfiedSeller;
      await user.save();

      let transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        cc: process.env.EMAIL,
        subject: "Account Verified",
        html: `
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <h2>Account Verification</h2>
        <p>Hello,</p>
        <p>You are now verified by the admin and can post products on the website. Thank you for being with us!</p>
        <p>Our representative will reach out to you through email soon to resolve your queries.</p>
        <p>If you have any immediate questions, feel free to contact us.</p>
    </div>
</body>
`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          req.flash("error", "An error occurred while sending the email.");
        } else {
          req.flash("success", "Seller is Now Verified: Check Mail Too");
        }
        res.redirect("/forgot");
      });

      return res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash("error", "An Error Occured While Verifying Seller");
      return res.redirect("/admin/dashboard");
    }
  }
);

router.delete(
  "/admin/:id/delete",
  isLoggedIn,
  isBlocked,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await User.deleteOne({ _id: id });
      const products = Product.find({ author: id });
      if (products) {
        await Product.deleteMany({ author: id });
      }
      req.flash("success", "User Deleted Successfully");
      return res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash("error", "An Error Occured While Deleting User");
      console.log(error);
      return res.redirect("/admin/dashboard");
    }
  }
);

router.post(
  "/admin/:id/block",
  isLoggedIn,
  isBlocked,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      user.isBlocked = !user.isBlocked;
      await user.save();
      req.flash("success", "User Updated Sucesfully");
      return res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error);
      req.flash(
        "error",
        "Error Faces While Updating User Please Contact IT team"
      );
      return res.redirect("/admin/dashboard");
    }
  }
);

module.exports = router;
