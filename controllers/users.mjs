import User from '../models/user.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import Campground from '../models/campground.mjs';

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

const renderProfilePage = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const campgrounds = await Campground.find({ author: user })
    res.render('campgrounds/profile', { user,  campgrounds })
})

const updateProfile = catchAsync(async (req, res) => {
    const { user, address } = req.body
    const updateduser = await User.findByIdAndUpdate(req.user._id, {
        username: user.username,
        profile: user.profile,
        mobile: user.mobile,
    },
        { new: true }
    );
    req.flash('Updated successfully')
    console.log(req.body)
    req.session.user = updateduser;
    res.redirect('/profile')
})

const renderBookmarks = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('bookmarks');
    const bookmarks = user.bookmarks
    res.render('campgrounds/bookmarks', { bookmarks })
})


const users = {
    renderRegisterForm,
    registerUser,
    renderLoginForm,
    loginUser,
    logoutUser,
    renderProfilePage,
    updateProfile,
    renderBookmarks
}

export default users