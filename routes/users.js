const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const storeReturnTo  = require('../utils/storeInfo');
const users = require("../controllers/users")

router.get('/register', users.renderRegisterForm)

router.post('/register', users.registerUser)

router.get('/login', users.renderLoginForm)

router.post('/login',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})




module.exports = router