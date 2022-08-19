const socket = io()

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')
var indicator_case = 3


const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  typing.innerHTML = ''
  //This name is the sender name; you are recipient here
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

socket.on('typing', data => {
  if (data.message.length == 0 || indicator_case == 0){
     typing.innerHTML = ''
   }
  else {
    if (indicator_case == 1){
      typing.innerHTML = '<p>' + data.name + ' is typing...</p>'
    }
    else if (indicator_case == 2){
      typing.innerHTML = `<p>${data.name}: ${data.message}...</p>`
    }
    else if (indicator_case == 3){
      typing.innerHTML = `<p>${data.name}: ${data.message.replace(/\S/g, "#")}...</p>`
    }
  }
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  //This name here is the sender name - so as soon as he hits the send, you send the message to the db
  post_message_data(message)
  appendMessage(`${name}: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

messageInput.addEventListener('input', function(){
  socket.emit('typing', messageInput.value)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function post_message_data(message){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
  var data = {
      "messages": {
          "chat_uuid" : "3b547d64-5c37-4f97-a7e2-4254bd9f06d0",
          "chat_name" : "front-end-version-2",
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