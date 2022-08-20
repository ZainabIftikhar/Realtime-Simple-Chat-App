<<<<<<< HEAD
<<<<<<< Updated upstream
const io = require('socket.io')(3000)
=======
=======
>>>>>>> master
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
  res.sendFile(__dirname + '/public/chat.html');
});

=======
>>>>>>> a5e8ead3ea37a3db45a8a6d05a30e9f9ac1574cd
  res.sendFile(__dirname + '/index.html');
=======
  res.sendFile(__dirname + '/public/chat.html');
>>>>>>> Stashed changes
});

// Will run the server on port 3000
// If you change the port make sure to change it in index.html and public/script.js
// If you plan to deply the server, you will need to change the files public/script.js and index.html to use your public IP

>>>>>>> master
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => { 
  console.log(`listening on port ${PORT}`);
});
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> master

const users = {}

// Socket has has not been changed
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
<<<<<<< HEAD
<<<<<<< Updated upstream
    post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
    socket.broadcast.emit('user-connected', name);
=======
    socket.broadcast.emit('user-connected', name)  
    //post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
>>>>>>> Stashed changes
=======
<<<<<<< HEAD
<<<<<<< Updated upstream
    socket.broadcast.emit('user-connected', name)
=======
    //post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
    socket.broadcast.emit('user-connected', name);
>>>>>>> Stashed changes
=======
    post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
    socket.broadcast.emit('user-connected', name);
>>>>>>> master
>>>>>>> a5e8ead3ea37a3db45a8a6d05a30e9f9ac1574cd
  })
  
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
  })
  
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id]
  })
  
  socket.on('typing', message => {
    socket.broadcast.emit('typing', { message: message, name: users[socket.id] });
  })
})