const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./utils/userObject');

const {
  post_event_message
} = require('./apis/post_event');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => { 
  console.log(`listening on port ${PORT}`);
});

// Socket has has not been changed
io.on('connection', socket => {
  socket.on('new-user', ({name, chat_uuid, room}) => {
    const user = newUser(socket.id, name, chat_uuid, room);
    socket.join(user.room)
    
    //post_message_data(`(${name} connected, ${Math.floor(new Date().getTime() / 1000)})`)
    //socket.broadcast.emit('user-connected', name);
  })
  
  socket.on('send-chat-message', message => {
    const user = getActiveUser(socket.id);
    socket.to(user.room).emit('chat-message', { message: message, name: user.name });
  })
  
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id)
  })
  
  socket.on('typing', message => {
    const user = getActiveUser(socket.id);
    socket.to(user.room).emit('typing', { message: message, name: user.name });
  })
})