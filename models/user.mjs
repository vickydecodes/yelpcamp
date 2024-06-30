import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'
const {Schema } = mongoose

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
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    mobile:{
        type: Number,
        default: 1234567890
    }
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema)

export default User