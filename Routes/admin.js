const express = require('express');
const router = express.Router();
const {
    isAdmin,
    isLoggedIn,
  } = require("../middlewares/middleware");

router.get('/admin/dashboard',isLoggedIn,isAdmin,(req,res)=>{
    res.render('admin/adminDashboard')
})

module.exports = router;