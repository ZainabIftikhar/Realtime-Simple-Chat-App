var request = require('request');

function post_event_message(chat_uuid, user_uuid, sender_name, room, event_message, flag){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
  //receiver_ID is a dummy value for now
  var data = {
      "messages": {
          "chat_uuid" : chat_uuid,
          "chat_name" : room,
          "sender_uuid" : user_uuid, 
          "sender_name": sender_name,
          "receiver_uuid" : user_uuid,
          "message_text" : event_message,
          "flag" : flag
      }
  }
  request.post(url, { json: data },
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
    }
);
};

module.exports = {
  post_event_message
};