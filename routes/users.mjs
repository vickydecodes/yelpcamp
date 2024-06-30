import express from 'express';
import passport from 'passport'
import storeReturnTo from '../utils/storeInfo.mjs';
import users from '../controllers/users.mjs'

const router = express.Router();


router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser)

router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logoutUser)

router.route('/profile')
    .get(users.renderProfilePage)
    .put(users.updateProfile)


router.route('/bookmarks')
    .get(users.renderBookmarks)

export default router