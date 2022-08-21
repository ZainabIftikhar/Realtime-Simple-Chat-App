const socket = io()

// Get name, chat_uuid, user_uuid and room from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name')
const chat_uuid = urlParams.get('chat_uuid')
const user_uuid = urlParams.get('user_uuid')
const room = urlParams.get('room')

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')

var keypressed_timestamped = ''

appendMessage(`${name} joined`)

socket.emit('new-user', {name, chat_uuid, user_uuid, room})

//Message received with recipient name
socket.on('chat-message', data => {
  typing.innerHTML = ''
  appendMessage(`${data.name}: ${data.message}`)
})

//Shows when other people connect
socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

//Shows when other people disconnect
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

socket.on('typing', data => {
  if (data.message.length == 0 || room == 0){ //No indicator
     typing.innerHTML = ''
   }
  else { //Is-typing indicator
    if (room == 1){
      typing.innerHTML = '<p>' + data.name + ' is typing...</p>'
    }
    else if (room == 2){ //Live typing
      typing.innerHTML = `<p>${data.name}: ${data.message}...</p>`
    }
    else if (room == 3){ //Masked typing
      typing.innerHTML = `<p>${data.name}: ${data.message.replace(/\S/g, "#")}...</p>`
    }
  }
})

//Message sent by sender - call API 
messageForm.addEventListener('submit', e => {
  e.preventDefault()

  post_message_data(name, chat_uuid, user_uuid, room, keypressed_timestamped)
  keypressed_timestamped = ''
  
  const message = messageInput.value
  appendMessage(`${name}: ${message}`)
  socket.emit('send-chat-message', message)
  typing.innerHTML = ''
  messageInput.value = ''
})

messageInput.addEventListener('input', function(e){
  socket.emit('typing', messageInput.value)
})

//Keys pressed by the sender - concatenate keys/events 
messageInput.addEventListener('keyup', function(e){
  keypressed_timestamped += `${e.key}, ${Math.floor(new Date().getTime() / 1000)};`
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
})

function post_message_data(message){
   var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
   var data = {
       "messages": {
           "chat_uuid" : "3b547d64-5c37-4f97-a7e2-4254bd9f06d0",
           "chat_name" : "front-end",
           "sender_uuid" : "15d18e55-f3c0-476b-bc05-ec12bc36780d",
           "receiver_uuid" : "f9748683-99f2-4246-b069-7f001ff1b3a4",
           "message_text" : message
       }
   }

   fetch(url, {
     method: 'POST', // or 'PUT'
     headers: {
       'Content-Type': 'application/json',
       'Accept' : '*/*',
     },
     body: JSON.stringify(data),
   })
   .then((response) => response.json())
     .then((data) => {
       console.log('Success:', data);
       appendMessage('sccess')
     })
     .catch((error) => {
       console.error('Error:', error);
       appendMessage('error')
     });
 } 