import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});



// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yelpcamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

const checkCloudinaryConnection = async () => {
    console.log({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    })
    try {
        const result = await cloudinary.api.ping();
        if (result.status === 'ok') {
            console.log('Cloudinary connection is successful.');
            return true;
        }
    } catch (error) {
        console.error('Cloudinary connection failed:', error);
        return false;
    }
};

export { cloudinary, storage, checkCloudinaryConnection };
