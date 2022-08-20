function post_event_message(chat_uuid, user_uuid, room, event_message){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
  var data = {
      "messages": {
          "chat_uuid" : chat_uuid,
          "chat_name" : chat_uuid + room,
          "sender_uuid" : user_uuid, 
          "receiver_uuid" : user_uuid, //dummy user for now
          "message_text" : event_message
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
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

module.exports = {
  post_event_message
};