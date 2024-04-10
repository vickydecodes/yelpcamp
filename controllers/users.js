const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.renderRegisterForm = (req, res) => {
    res.render('../views/users/register')
}

module.exports.registerUser = catchAsync(async (req, res) => {
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
})

module.exports.renderLoginForm = (req, res) => {
    res.render('../views/users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}