import catchAsync from '../utils/catchAsync.mjs';
import Campground from '../models/campground.mjs';
import { cloudinary } from '../cloudinary/main.mjs';
import User from '../models/user.mjs';
import * as maptilerClient from '@maptiler/client';

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY

const renderIndex = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds })
})

const renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

const searchCampgrounds = catchAsync(async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const search = searchTerm.toLowerCase().trim().split(' ').join('')
        const campgrounds = await Campground.find({ searchTerm: { $regex: search } });
        res.render('./campgrounds/index', { campgrounds })
    } catch (e) {
        console.log(e)
    }
})

const createNewCampground = catchAsync(async (req, res) => {
    try {
        const campground = new Campground(req.body.campground);
        const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
        console.log({geoData: geoData})
        campground.geometry.type = geoData.features[0].geometry.type;
        campground.geometry.coordinates = geoData.features[0].center
        campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        campground.author = req.user._id;
        campground.recommendedPlaces = [...req.body.places];
        campground.postDate = new Date();
        await campground.save();
        req.flash('success', 'Sucessfully added a campground!')
        res.redirect(`/campgrounds/${campground.id}`);
        console.log(campground)
    } catch (e) {
        console.log(e)
    }
})

const showCampground = catchAsync(async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');

        if (!campground) {
            req.flash('error', 'There is no such campground!')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { campground });
    } catch (e) {
        console.log(e)
    }
})

const renderEditForm = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash('error', 'Cannot find that campground!')
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/edit', { campground })
    } catch (e) {
        console.log(e)
    }
})

const editCampground = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        campground.images.push(...imgs);
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename)
            }
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        campground.recommendedPlaces = [...req.body.places];
        const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
        campground.geometry.type = geoData.features[0].geometry.type;
        campground.geometry.coordinates = geoData.features[0].center
        await campground.save();
        req.flash('success', 'Sucessfully updated the campground!')
        res.redirect(`/campgrounds/${campground.id}`)
    } catch (e) {
        console.log(e)
    }

})

const deleteCampground = async (req, res) => {
    try {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('error', 'Sucessfully deleted the campground!')
        res.redirect('/campgrounds')
    } catch (e) {
        console.log(e)
    }
}

const addToBookmarks = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        const user = await User.findById(req.user._id).populate('bookmarks');
        const isCampgroundinBookmarks = user.bookmarks.some(mark => mark.id === campground.id);
        if (isCampgroundinBookmarks) {
            req.flash('error', 'The campground is already added to your Bookmarks!');
        } else {
            await user.bookmarks.unshift(campground);
            await user.save();
            req.session.user = user;
            req.flash('success', 'Successfully added the campground to your bookmarks!');
        }
        res.redirect('/bookmarks')
    } catch (e) {
        console.log(e)
    }
})


const campgrounds = {
    renderIndex,
    createNewCampground,
    renderNewForm,
    showCampground,
    renderEditForm,
    editCampground,
    deleteCampground,
    searchCampgrounds,
    addToBookmarks
};

export default campgrounds