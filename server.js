const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

// Will run the server on port 3000
// If you change the port make sure to change it in index.html and public/script.js
// If you plan to deply the server, you will need to change the files public/script.js and index.html to use your public IP

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => { 
  console.log(`listening on port ${PORT}`);
});

const users = {}

// Socket has has not been changed
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    //post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
    socket.broadcast.emit('user-connected', name);
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