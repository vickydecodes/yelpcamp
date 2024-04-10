const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../utils/middleware.js')
const campgrounds = require('../controllers/campgrounds.js');

router.route('/')
    .get(campgrounds.renderIndex)
    .post(validateCampground, campgrounds.createNewCampground);

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(isLoggedIn, campgrounds.showCampground)
    .put(isLoggedIn, validateCampground, isAuthor, campgrounds.editCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)


module.exports = router;