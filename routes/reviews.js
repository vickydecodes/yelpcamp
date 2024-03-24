const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync.js');
const expressError = require('../utils/expressError.js');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const {isLoggedIn, validateCampground, validateReview, isReviewAuthor} = require('../utils/middleware.js')



router.post('/', validateReview,isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'Sucessfully posted the review!')
    res.redirect(`/campgrounds/${campground.id}`)

}))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = Review.findById(id)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('error', 'Sucessfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)

})

module.exports = router