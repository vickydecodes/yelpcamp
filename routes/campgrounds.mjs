import express from 'express';
import { isLoggedIn, validateCampground, isAuthor } from '../utils/middleware.mjs';
import campgrounds from '../controllers/campgrounds.mjs';
import multer from 'multer';
import { storage } from '../cloudinary/main.mjs';

const router = express.Router();
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.renderIndex)

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)
    .post(isLoggedIn, upload.array('image'),validateCampground, campgrounds.createNewCampground);


router.post('/:id/favourites', isLoggedIn, campgrounds.addToFavourites);


router.route('/search')
.get(isLoggedIn, campgrounds.searchCampgrounds);

router.route("/:id")
    .get(isLoggedIn, campgrounds.showCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)


router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, campgrounds.renderEditForm)
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, campgrounds.editCampground)


export default router;
