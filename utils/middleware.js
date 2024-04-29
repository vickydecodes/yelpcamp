const { reviewSchema, campgroundSchema } = require('../schema.js');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const catchAsync = require('./catchAsync.js');
const expressError = require('./expressError.js')


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400)
    } else {
        next();
    }
}



module.exports.validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new expressError(msg, 400)
    } else {
      next();
    }
  }

module.exports.isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})
