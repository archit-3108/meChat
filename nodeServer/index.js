// NODE SERVER which will handle socket.io connections
// const io = require('socket.io')(8000);
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket => {
    // If any new user joins, let  other users conncte to the server know...
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    // If someone sends a message, broadcast it to all other people. 

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

    // If someone disconnect the chat, then let others know it.
    socket.on('disconnect',message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})