const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../utils/middleware.js')
const campgrounds = require('../controllers/campgrounds.js');

router.get('/', campgrounds.renderIndex)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', validateCampground, campgrounds.createNewCampground);

router.get('/:id', isLoggedIn, campgrounds.showCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm )

router.put('/:id', isLoggedIn, validateCampground, isAuthor, campgrounds.editCampground);

router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground)

module.exports = router;