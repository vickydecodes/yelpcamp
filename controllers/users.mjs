import User from '../models/user.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const renderRegisterForm = (req, res) => {
    res.render('../views/users/register')
}

const registerUser = catchAsync(async (req, res) => {
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

const renderLoginForm = (req, res) => {
    res.render('../views/users/login')
}

const loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}

const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}


const users = {
    renderRegisterForm,
    registerUser,
    renderLoginForm,
    loginUser,
    logoutUser
}

export default users