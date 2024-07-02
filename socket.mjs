import { Server } from 'socket.io';

let io;


///SOCKET INITIALIZATION

function initializeSocket(server) {
    io = new Server(server);

    io.on('connection', socket => {
        console.log('Socket connected:', socket.id);


        socket.on('join', user => {
            socket.join(user);
            console.log(`${user} is on the socket`)
        });
   


    socket.on('disconnect', () => {
        userMap.forEach((value, key) => {
            if (value === socket.id) {
                userMap.delete(key);
            }
        });
        console.log('Socket disconnected:', socket.id);
    });
});
}

///SEND MESSAGE FUNCTIONS FOR BOTH CUSTOMERS AND SELLERS


function addLikes(user, likecount) {

}






///EXPORTATIONS

export { initializeSocket };
