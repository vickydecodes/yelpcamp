import Campground from '../models/campground.mjs';
import Review from '../models/review.mjs';
import catchAsync from '../utils/catchAsync.mjs';


const postReview = catchAsync(async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review)
        await review.save();
        await campground.save();
        req.flash('success', 'Sucessfully posted the review!')
        res.redirect(`/campgrounds/${campground.id}`)
    } catch (e) {
        console.log(e)
    }
})

const deleteReview = catchAsync(async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await Review.findByIdAndDelete(reviewId)
        req.flash('error', 'Sucessfully deleted the review!')
        res.redirect(`/campgrounds/${id}`)
    } catch (e) {
        console.log(e)
    }

})

const reviews = {
    postReview,
    deleteReview
}

export default reviews