import express from 'express';
import {isLoggedIn, validateReview, isReviewAuthor} from '../utils/middleware.mjs'
import reviews from '../controllers/reviews.mjs'


const router = express.Router({mergeParams: true})

router.post('/', validateReview,isLoggedIn, reviews.postReview)

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, reviews.deleteReview)

export default router