import { Server } from 'socket.io';
import Campground from './models/campground.mjs'
import User from './models/user.mjs';

let io;

// SOCKET INITIALIZATION
function initializeSocket(server) {
    io = new Server(server);
    console.log('Socket io connected');




    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('addLike', async data => {
            console.log(data)
            const { user, campground } = data
            const campground2 = await Campground.findById(campground);
            campground2.likes.totalLikes++;
            campground2.likes.likedBy.push(user);
            await campground2.save();

            socket.emit('likeCount', campground2.likes.totalLikes)
        })

        socket.on('dislike', async data => {
            console.log(data)
            const { user, campground } = data
            const campground2 = await Campground.findById(campground);
            const filteredArray = campground2.likes.likedBy.filter(likedUser => likedUser.id !== user)
            console.log({ filteredArray: filteredArray })
            campground2.likes.likedBy = filteredArray
            if (campground2.likes.totalLikes > 0) {
                campground2.likes.totalLikes--;
            } else {
                campground2.likes.totalLikes = 0
            }
            await campground2.save();
            socket.emit('likeCount', campground2.likes.totalLikes)
        })


        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}






// Exporting the initialization function
export { initializeSocket };
