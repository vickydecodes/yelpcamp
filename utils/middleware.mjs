import { reviewSchema, campgroundSchema } from'../schema.mjs';
import Campground from'../models/campground.mjs';
import Review from'../models/review.mjs';
import catchAsync from'./catchAsync.mjs';
import expressError from'./expressError.mjs'


export const isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login')
    }
    next()
}

export const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400)
    } else {
        next();
    }
}



export const validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new expressError(msg, 400)
    } else {
      next();
    }
  }

export const isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

export const isReviewAuthor = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})
