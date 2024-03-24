const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const  storeReturnTo  = require('../utils/storeInfo');

router.get('/register', (req, res) => {
    res.render('../views/users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = (req.body.user);
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);

            req.flash('success', `Welcome to Yelpcamp! ${registeredUser.username}`)
            res.redirect('/campgrounds')


        })
    } catch (e) {
        req.flash('error', `${e.message}`)
        res.redirect('/register')
        console.log(e)
    }
}))

router.get('/login', (req, res) => {
    res.render('../views/users/login')
})

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req, res) => {
//     const { username } = req.body
//     req.flash('success', `welcome back! ${username}`);
//     const redirectUrl =  res.locals.returnTo || '/campgrounds'
//     res.redirect(redirectUrl)

// })

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });

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