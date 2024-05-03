const catchAsync = require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const { cloudinary } = require('../cloudinary/main.js')
const maptilerClient = require('@maptiler/client')
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY

module.exports.renderIndex = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds })
})

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = catchAsync(async (req, res) => {
    const campground = req.body.campground;
    // const response = await fetch(`https://api.maptiler.com/geocoding/${campground.place}.json?language=en&limit=`)
    const result = await maptilerClient.geocoding.forward(campground.place, {limit: 1})
    // const geocodeData = await response.json();
    console.log(campground)
    res.send(result)
    // campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // campground.author = req.user._id;
    // await campground.save();
    // req.flash('success', 'Sucessfully added a campground!')
    // res.redirect(`/campgrounds/${campground.id}`);
})

module.exports.showCampground = catchAsync(async (req, res) => {
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
})

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })

})

module.exports.editCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body.deleteImages)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save();
    req.flash('success', 'Sucessfully updated the campground!')
    res.redirect(`/campgrounds/${campground.id}`)
})

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('error', 'Sucessfully deleted the campground!')
    res.redirect('/campgrounds')

}