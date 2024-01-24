const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        default: 'buyer',
        required: true
    },
    isVeryfiedSeller: {
        type: Boolean,
        default: 'false',
    },
    isAdmin: {
        type: Boolean,
        default: 'false',
    },
    cart: [cartItemSchema],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
