const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
    try{
        const { username, password, options, email,isVeryfiedSeller,isAdmin } = req.body;
    let role;
    if (options === 'buyer') {
        role = 'buyer';
    } else if (options === 'seller') {
        role = 'seller';
    } else {
        role = 'defaultRole';
    }

    const user = new User({ username, role, email, isVeryfiedSeller,isAdmin });
    if(options === 'buyer'){
        req.flash('success','Buyer Account Created Sucessfully')
    } else if(options === 'seller'){
        req.flash('success','Seller Account Created. You Can Add Products Once Veryfied By Admin. Thankyou For Your Patience')
    }
    await User.register(user, password);
    res.redirect('/login');
    }
    catch(error){
        req.flash('error','Internal server Error While Creating Accunt');
        res.status(500).send(`Internal Server Error ${error}`)
    }
    
});

router.get('/login',(req,res)=>{
    res.render('auth/login')
})

router.post('/login',
passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: true
}),
function(req,res){
    req.flash('success', `Welcome Back ${req.user.username}`)
    res.redirect('/home')
}
);

router.get('/logout',(req,res)=>{
    try {
        req.logout(()=>{
            req.flash("success",'loged out sucesfully')
        })
        res.redirect('/login')
    } catch (error) {
        req.flash('error','Error Logging out Plas Try Again After Hard Refresh')
        res.status(500)
    }
    
})

module.exports = router;
