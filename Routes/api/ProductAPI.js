const express = require("express");
const router = express.Router();
const {isLoggedIn,isBlocked,} = require('../../middlewares/middleware');
const User = require("../../models/User");

router.post('/product/:id/like',isBlocked,isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    const user = req.user;
    const isLiked = user.wishlist.includes(id);
    if(isLiked){
        await User.findByIdAndUpdate(req.user._id,{$pull: {wishlist:id}})
    }
    else{
        await User.findByIdAndUpdate(req.user._id,{$addToSet: {wishlist:id}})
    }
    res.status(201).send('ok');
})

module.exports = router;
