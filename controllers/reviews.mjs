import Campground from '../models/campground.mjs';
import Review from '../models/review.mjs';
import catchAsync from '../utils/catchAsync.mjs';


const postReview = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'Sucessfully posted the review!')
    res.redirect(`/campgrounds/${campground.id}`)
})

const deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('error', 'Sucessfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)

})

const reviews = {
    postReview, 
    deleteReview
}

export default reviews