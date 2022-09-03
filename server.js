const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { getActiveUser, exitRoom, newUser, getIndividualRoomUsers} = require('./utils/userObject');
const { authenticate} = require('./utils/authenticate');

const { post_event_message } = require('./apis/post_event');
const { list_messages } = require('./apis/get_messages');

app.use(express.static('public'));

app.get('/', (req, res) => { res.sendFile(__dirname + '/public/chat.html');});

const PORT = process.env.PORT || 5000;
const c = true;

server.listen(PORT, () => { console.log(`listening on port ${PORT}`);});


io.on('connection', socket => {
  socket.on('new-user', ({name, chat_uuid, user_uuid, room}) => {
    
    const [authenticate_flag, task] = authenticate(chat_uuid, user_uuid, room)
    if (authenticate_flag == false) {
      var destination = '/error.html';
      socket.emit(socket.id).emit('redirect', destination);
      return
    }
    
    const user = newUser(socket.id, name, chat_uuid, user_uuid, room);    
    socket.join(room + chat_uuid);
    socket.to(room + chat_uuid).emit('user-connected', name);
    socket.emit(socket.id).emit('chat-message', { message: task, name: "Problem" });
    
    post_event_message(chat_uuid, user_uuid, name, room, 
      `[${name} connected: ${Math.floor(new Date().getTime() / 1000)}]`, false);
    
    async function call_get_messages() {
      json = await list_messages(chat_uuid);
      obj = JSON.parse(json);
      var size = Object.keys(obj.data).length;
      for (let i = 0; i < size; i++) { 
        senderName = obj.data[i].attributes.senderName;
        messageText = obj.data[i].attributes.messageText
        socket.emit(socket.id).emit('chat-message', { message: messageText, name: senderName });
      }
    }
    //call_get_messages();
  })
  
  socket.on('send-chat-message', message => {
    const user = getActiveUser(socket.id);
    if (typeof user != 'undefined'){
    socket.to(user.room + user.chat_uuid).emit('chat-message', { message: message.text, name: user.name });
    
    post_event_message(user.chat_uuid, user.user_uuid, user.name, user.room, 
      `[${message.keys_timestamped}: ${Math.floor(new Date().getTime() / 1000)}]`, false);
    
    post_event_message(user.chat_uuid, user.user_uuid, user.name, user.room, message.text, true);
  }
  })
  
  socket.on('disconnect', () => {
    const user = getActiveUser(socket.id);
    if (typeof user != 'undefined'){
      socket.to(user.room + user.chat_uuid).emit('user-disconnected', user.name);
      
      post_event_message(user.chat_uuid, user.user_uuid, user.name, user.room, 
        `[${user.name} disconnected: ${Math.floor(new Date().getTime() / 1000)}]`, false);
    }
    exitRoom(socket.id);
  })
  
  socket.on('typing', message => {
    const user = getActiveUser(socket.id);
    if (typeof user != 'undefined'){
      socket.to(user.room + user.chat_uuid).emit('typing', { message: message, name: user.name });
    }
    })
})