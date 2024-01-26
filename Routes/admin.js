const express = require('express');
const router = express.Router();
const {
    isAdmin,
    isLoggedIn,
  } = require("../middlewares/middleware");
const User = require('../models/User');
const Product = require('../models/Product');

router.get('/admin/dashboard',isLoggedIn,isAdmin,async (req,res)=>{
  const users = await User.find({});
    res.render('admin/adminDashboard',{users})
})

router.post('/admin/:id/seller/verify',isLoggedIn,isAdmin, async(req,res)=>{
  try { 
    const {id} = req.params;
  const user = await User.findById(id);
  user.isVeryfiedSeller = !user.isVeryfiedSeller;
  await user.save();
  req.flash('success','Seller is Now Verified');
  return res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error','An Error Occured While Verifying Seller');
    return res.redirect('/admin/dashboard');
  }
})

router.delete('/admin/:id/delete',isLoggedIn,isAdmin, async(req,res)=>{
  try { 
    const {id} = req.params;
  await User.deleteOne({_id:id});
  const products = Product.find({author:id});
  if(products){
    await Product.deleteMany({author:id});
  }
  req.flash('success','User Deleted Successfully');
  return res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error','An Error Occured While Deleting User');
    console.log(error);
    return res.redirect('/admin/dashboard');
  }
});

module.exports = router;