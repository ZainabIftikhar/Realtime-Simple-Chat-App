const { participants_group_1} = require('./utils/schedule');
//const { participants_group_2} = require('./utils/schedule');
//const { participants_group_3} = require('./utils/schedule');
var tc = require("timezonecomplete");   

var allow_access = false;

const group1_slot = new tc.DateTime("2022-08-30T12:00:00 localtime")
const group2_slot = new tc.DateTime("2022-08-31T12:00:00 localtime")
const group3_slot = new tc.DateTime("2022-09-01T12:00:00 localtime")

const current_time = new tc.DateTime("2022-08-30T12:50:00 localtime");

const diff_from_group_1 = current_time.diff(group1_slot).minutes()
const diff_from_group_2 = current_time.diff(group2_slot).minutes()
const diff_from_group_3 = current_time.diff(group3_slot).minutes()


function authenticate(chat_uuid, user_uuid, room){
  if (diff_from_group_1 > 0 && diff_from_group_1 < 60){
    var slot = participants_group_1[chat_uuid]
    if ((slot.user1 === user_uuid || slot.user2 === user_uuid) && slot.room === room){
      allow_access = true 
    }
  } 
  else if (diff_from_group_2 > 0 && diff_from_group_2 < 60) {
    var slot = participants_group_2[chat_uuid]
    if ((slot.user1 === user_uuid || slot.user2 === user_uuid) && slot.room === room){
      allow_access = true 
    }
  }
  else if (diff_from_group_3 > 0 && diff_from_group_3 < 60) {
    var slot = participants_group_3[chat_uuid]
    if ((slot.user1 === user_uuid || slot.user2 === user_uuid) && slot.room === room){
      allow_access = true 
    }
  }
  return allow_access
}

module.exports = {
  authenticate
}