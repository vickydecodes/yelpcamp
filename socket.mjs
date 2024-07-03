import { Server } from 'socket.io';
import Campground from './models/campground.mjs'

let io;

// SOCKET INITIALIZATION
function initializeSocket(server) {
    io = new Server(server);
    console.log('Socket io connected');


   

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

    socket.on('addLike', async data =>{
            console.log(data)
            const {user, campground } = data
            const campground2 = await Campground.findById(campground);
            if(campground2.likes.likedBy.includes(data.user)){
                socket.emit('likeError', 'You cannot like the post again after liking it once.');
            }else{
                campground2.likes.totalLikes = campground2.likes.totalLikes + 1;
                campground2.likes.likedBy.push(user);
                await campground2.save();
            }
            socket.emit('likeCount', campground2.likes.totalLikes)
        })


        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}






// Exporting the initialization function
export { initializeSocket };
