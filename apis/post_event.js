var request = require('request');

function post_event_message(chat_uuid, user_uuid, room, event_message){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
  var data = {
      "messages": {
          "chat_uuid" : chat_uuid,
          "chat_name" : chat_uuid + room,
          "sender_uuid" : user_uuid, 
          "receiver_uuid" : user_uuid,
          "message_text" : event_message
      }
  }
  request.post(url, { json: data },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
);
};

module.exports = {
  post_event_message
};