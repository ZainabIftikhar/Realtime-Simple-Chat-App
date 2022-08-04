const socket = io('http://localhost:3000')

//StackOverflow code following youtube tutorial
//Reference: https://stackoverflow.com/questions/16766488/socket-io-how-to-check-if-user-is-typing-and-broadcast-it-to-other-users

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typing = document.getElementById('typing')
var live_message = ''

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  typing.innerHTML = ''
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

socket.on('typing', data => {
  typing.innerHTML = `<p>${data.name}: ${data.message}...</p>`
})

socket.on('back_space', data => {
  typing.innerHTML = ''
  typing.innerHTML = `<p>${data.name}: ${data.message}...</p>`
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`${name}: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
  live_message = ''
})

messageInput.addEventListener('keypress', (e) => {
  live_message += e.key
  socket.emit('typing', live_message)
  //const parent = document.querySelector('#message-input');
  //const children = parent.querySelectorAll(':scope > div');
  //socket.emit('typing', Object.values(children))
})

messageInput.addEventListener('keydown', (e) => {
  if (e.key == 'Backspace'){
    live_message = live_message.slice(0, - 1)
  }
  socket.emit('back_space', live_message)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}