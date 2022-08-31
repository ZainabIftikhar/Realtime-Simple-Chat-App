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


const no_indicator_qualtircs  = 'https://brown.co1.qualtrics.com/jfe/form/SV_1zxp3J3EnjSZII6'
const is_typing_qualtrics  = 'https://brown.co1.qualtrics.com/jfe/lo form/SV_9yJJOjCpvVunDym'
const live_typing_qualtrics = 'https://brown.co1.qualtrics.com/jfe/form/SV_5vFFHbqEzs1WM86'
const masked_typing_qualtrics = 'https://brown.co1.qualtrics.com/jfe/form/SV_aVvn6NawNsvCBBI' 

var qualtrics_dict = {
  0: no_indicator_qualtircs,
  1: is_typing_qualtrics,
  2: live_typing_qualtrics,
  3: masked_typing_qualtrics
};

var keypressed_timestamped = ''

socket.emit('new-user', {name, chat_uuid, user_uuid, room})

//Message received with recipient name
socket.on('chat-message', data => {
  typing.textContent = ''
  if (data.name == 'Problem'){
    appendMessageHTML(`${data.name}: ${data.message}`)
    appendMessage(`${name} joined`)
  }
  else {
    appendMessage(`${data.name}: ${data.message}`)
  }
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
     typing.textContent = ''
   }
  else { //Is-typing indicator
    if (room == 1){
      typing.textContent = `${data.name} is typing...`
    }
    else if (room == 2){ //Live typing
      typing.textContent = `${data.name}: ${data.message}...`
    }
    else if (room == 3){ //Masked typing
      typing.textContent = `${data.name}: ${data.message.replace(/\S/g, "#")}...`
    }
  }
})

socket.on('redirect', function(destination) {
  appendMessage("redirect")
  window.location.href = destination;
});

//Message sent by sender - call API 
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  
  const message = messageInput.value
  appendMessage(`${name}: ${message}`)
  
  socket.emit('send-chat-message', {text: message, keys_timestamped: keypressed_timestamped})
  
  messageContainer.scrollTop = messageContainer.scrollHeight;

  keypressed_timestamped = ''
  typing.textContent = ''
  messageInput.value = ''
})

messageInput.addEventListener('input', function(e){
  socket.emit('typing', messageInput.value)
})

//Keys pressed by the sender - concatenate keys/events 
messageInput.addEventListener('keyup', function(e){
  keypressed_timestamped += `(${e.key}: ${Math.floor(new Date().getTime() / 1000)})`
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.textContent = message
  messageContainer.append(messageElement)
}

function appendMessageHTML(message) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
  messageContainer.append(messageElement)
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom? This will take you to the survey.');
  if (leaveRoom) {
    window.location = qualtrics_dict[room] 
  } else {
  }
})