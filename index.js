const express = require("express");
const path = require("path");
const app = express();
const dotenv = require('dotenv').config();
const session = require('express-session')
const flash = require('connect-flash');
const methodoverride = require("method-override");
const mongoose = require("mongoose");
const productRoutes = require("./Routes/product");
const globalRoutes = require('./Routes/global');
const cartRoutes = require('./Routes/cart')
const cookieParser = require('cookie-parser')
const adminRoutes = require('./Routes/admin')
const authRoutes = require('./Routes/auth')
const reviewRoutes = require('./Routes/review')
const ProductAPI = require('./Routes/api/ProductAPI')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require("./models/User");
const cors = require('cors')
app.use(cors());
const uri = process.env.ATLAS_URL

mongoose
  .connect(uri)
  .then(() => {
    console.group("connected to Database");
    let PORT = process.env.PORT
    app.listen(PORT, () => {
      console.log(`listening to the port: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting the database: ${err}`);
  });

let configSession = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now()+ 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000
  }
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(cookieParser())
app.use(session(configSession))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use(productRoutes);
app.use(globalRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(ProductAPI);
app.use(cartRoutes);
app.use(adminRoutes);