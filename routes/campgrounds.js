const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../utils/middleware.js')
const campgrounds = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary/main.js');
const upload = multer({  storage })

router.route('/')
    .get(campgrounds.renderIndex)
    // .post(isLoggedIn, validateCampground, campgrounds.createNewCampground);
    .post(upload.array('image'), (req, res) =>{
       console.log(req.body, req.files)
       res.send('IT WORKED')
    }) 

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(isLoggedIn, campgrounds.showCampground)
    .put(isLoggedIn, validateCampground, isAuthor, campgrounds.editCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)


module.exports = router;