import baseJoi from 'joi'
import sanitizeHtml from 'sanitize-html';

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension)



export const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required(),
       
    }).required(),
    geometry: Joi.object({
        type: Joi.string(),
        coordinates: Joi.array().items(Joi.number()).required()
    }).required(),
    places: Joi.array().items(Joi.string().escapeHTML()),
    deleteImages: Joi.array().items(Joi.string())
});

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()

});

