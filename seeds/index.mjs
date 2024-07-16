import mongoose from 'mongoose';
import Campground from '../models/campground.mjs';
import cities from './cities.mjs';
import { descriptors, places } from './seedhelpers.mjs'

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100);
        const camp = new Campground({
            author: '65b381c1d9db208b4d60efd6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude,
              ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/dskpugzno/image/upload/v1721022515/Yelpcamp/srb4hmoymxn0debksyc3.jpg',
                  filename: 'Yelpcamp/srb4hmoymxn0debksyc3',
                },
                {
                  url: 'https://res.cloudinary.com/dskpugzno/image/upload/v1721021399/Yelpcamp/r8bia6kfj5p3qsp1k2dp.jpg',
                  filename: 'Yelpcamp/r8bia6kfj5p3qsp1k2dp',
                }
              ],
            description: 'Lorem ispum dolor sir amet consectetr apidi skdhfkhd ahdhfhd  ahaha  dhehe agdbckeb dhdhd a fheifbe ',
            price: `${price}`
        });
        await camp.save();
    }

}

seedDb().then(() => {
    mongoose.connection.close();
});