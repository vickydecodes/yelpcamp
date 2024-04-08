const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const catchAsync = require('../utils/catchAsync.js');


module.exports.postReview = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'Sucessfully posted the review!')
    res.redirect(`/campgrounds/${campground.id}`)
})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = Review.findById(id)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('error', 'Sucessfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)

})