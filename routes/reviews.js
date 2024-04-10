const express = require('express');
const router = express.Router({mergeParams: true});
const {isLoggedIn, validateReview, isReviewAuthor} = require('../utils/middleware.js')
const reviews = require('../controllers/reviews.js')

router.post('/', validateReview,isLoggedIn, reviews.postReview)

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router