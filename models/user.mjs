import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'
const {Schema } = mongoose


const imageSchema = new Schema({
    url: {
        type: String,
        default: 'https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg'
    },

    filename: {
        type: String
    }
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const UserSchema = new Schema ({
    email:{
        type: String,
        required: true,
        unique: true
    },
    bookmarks:[{
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }],
    profile:{
        type:imageSchema,
        default: () => ({})
    },
    mobile:{
        type: Number,
        default: 1234567890
    },
    name:{
        type:String,
        default: 'Anonymous'
    }
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema)

export default User