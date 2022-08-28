var request = require('request');

async function list_messages(chat_uuid){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message-by-chat-uuid/"
  url += chat_uuid
  url += "?flag=true"
  
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  list_messages
};