const express = require('express');
const router = express.Router();
const {
    isAdmin,
    isLoggedIn,
  } = require("../middlewares/middleware");
const passport = require("passport");
const Admin = require('../models/Admin');

router.get('/admin/dashboard/create/user',isLoggedIn,(req,res)=>{
    res.render('adminSignup')
})

router.post('/admin/dashboard/create/user',isLoggedIn,async (req,res)=>{
    try {
        const {username,password,fullname}=req.body;
        const admin = new Admin({username,fullname});
        await Admin.register({admin,password})
        res.redirect('/admin/dashboard/login');
    } catch (error) {
        req.flash('error','Internal server Error While Creating Admin');
        res.status(500).send(`Internal Server Error ${error}`)
    }
    
});

router.get('/admin/dashboard/user/login',(req,res)=>{
    res.render('adminLogin')
})

router.post('/admin/dashboard/create/login',
passport.authenticate('local',{
    failureRedirect: '/admin/dashboard/user/login',
    failureFlash: true
}),
function(req,res){
    req.flash('success', `Welcome Back ${req.user.username}`)
    res.redirect('/admin/dashboard')
}
);

router.get('/admin/dashboard',isLoggedIn,isAdmin,(req,res)=>{
    res.render('adminDashboard')
})

module.exports = router;