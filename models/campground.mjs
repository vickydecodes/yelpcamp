import mongoose from 'mongoose';
import Review from '../models/review.mjs'; // Assuming review.mjs is the correct file extension

const { Schema } = mongoose;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [imageSchema],
    description: String,
    location: {
        place: String,
        lat: Number,
        lon: Number,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

export default Campground;
