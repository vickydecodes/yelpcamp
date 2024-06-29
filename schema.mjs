import Joi from 'joi'


export const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        // Add more validations as needed for other campground fields
    }).required(),
    deleteImages: Joi.array().items(Joi.string()) // Assuming deleteImages is an array of strings (filenames)
});


export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()

});

