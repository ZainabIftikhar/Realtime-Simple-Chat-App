function post_message_data(message){
  var url = "https://nhipj3fca6.execute-api.us-east-1.amazonaws.com/dev/message"
  var data = {
    "messages": {
      "chat_uuid" : "3b547d64-5c37-4f97-a7e2-4254bd9f06d0",
      "chat_name" : "sending_from_front_end",
      "sender_uuid" : "15d18e55-f3c0-476b-bc05-ec12bc36780d",
      "receiver_uuid" : "f9748683-99f2-4246-b069-7f001ff1b3a4",
      "message_text" : "sending this from the front end (chat app)"
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
