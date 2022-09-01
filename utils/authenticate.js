const { participants_group_1} = require('./schedule');
const { participants_group_2} = require('./schedule');
const { participants_group_3} = require('./schedule');
const { task1 } = require('./problems');
const { task2 } = require('./problems');
const { task3 } = require('./problems');
const { task4 } = require('./problems');
var tc = require("timezonecomplete");   

process.env.TZ = 'America/New York' 

var allow_access = false;

///////////
///////////
//////////
const group1_slot = new tc.DateTime("2022-08-31T00:00:00 America/New_York") //actual time: rn its wed 9pm
const group2_slot = new tc.DateTime("2022-08-31T00:00:00 America/New_York")
const group3_slot = new tc.DateTime("2022-08-31T21:00:00 America/New_York")

const current_time = new tc.DateTime();

///////////
///////////
///////////

var task_dict = {
  1: task1,
  2: task2,
  3: task3,
  4: task4
};

const diff_from_group_1 = current_time.diff(group1_slot).minutes()
const diff_from_group_2 = current_time.diff(group2_slot).minutes()
const diff_from_group_3 = current_time.diff(group3_slot).minutes()


function authenticate(chat_uuid, user_uuid, room){
  if ((diff_from_group_1 => 0) && (diff_from_group_1 <= 60)){
    var slot = participants_group_1[chat_uuid]
    if (typeof slot === 'undefined'){
      return [allow_access, ''] 
    }
    else if ((slot.user1 == user_uuid || slot.user2 == user_uuid) && slot.room == room){
      allow_access = true
      return [allow_access, task_dict[slot.problem]] 
    }
  } 
  else if ((diff_from_group_2 => 0) && (diff_from_group_2 <= 60)) {
    var slot = participants_group_2[chat_uuid]
    if (typeof slot === 'undefined'){
      return [allow_access, ''] 
    }
    else if ((slot.user1 == user_uuid || slot.user2 == user_uuid) && slot.room == room){
      allow_access = true
      return [allow_access, task_dict[slot.problem]] 
    }
  }
  else if ((diff_from_group_3 => 0) && (diff_from_group_3 <= 60)) {
    var slot = participants_group_3[chat_uuid]
    if (typeof slot === 'undefined'){
      return [allow_access, ''] 
    }
    else if ((slot.user1 == user_uuid || slot.user2 == user_uuid) && slot.room == room){
      allow_access = true
      return [allow_access, task_dict[slot.problem]] 
    }
  }
  return [allow_access, ''] 
}

module.exports = {
  authenticate
}