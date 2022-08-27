var request = require('request');

function list_messages(chat_uuid, callback = () => {}){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message-by-chat-uuid/"
  url += chat_uuid
  url += "?flag=true"
  
  request.get(url, { json: true },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.stringify(body);
            console.log(json);
            return callback(json);
        }
    }
);
};

module.exports = {
  list_messages
};