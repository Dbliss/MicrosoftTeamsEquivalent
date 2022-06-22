
import {
  getData,
  setData,
} from './dataStore.js';


// Function to create a new channel with the passed name and assign if it is public or not. User(authUserId) is added to the channel by default

// Arguments:
// authUserId (integer) - User ID of the user creating the channel
// name (string) - Name of the new channel
// isPublic (boolean) - States if channel is public or private

// Return Values:
// Returns {channelId: <channelId>} (integer) on valid authUserId and name
// Returns {error: 'error'} on invalid authUserId - Being authUserId does not exist
// Returns {error: 'error'} on invalid name - name must be in between 1 and 20 characters inclusive  




function channelsCreateV1(authUserId, name, isPublic) {
  
  let data = getData();
  let validId = false;
  // Validates the authUserId Passed
  for(let i = 0; i < data.user.length; i++) {
    if(data.user[i].authUserId === authUserId.authUserId) {
      validId = true;
    }
  }
  // Returns error message when authUserId or name is invalid
  if(validId === false || name.length < 1 || name.length > 20) {
    return {error: 'error'};
  }
  
  let newChannel = {
                      cId: Date.now(),
                      name: name,
                      isPublic: isPublic,
                      start: authUserId,
                      members: [authUserId],};
                      
  data.channel.push(newChannel);
  setData(data);
  
  return {
    channelId: newChannel.cId,
  };
}

// Function to list channels with their details that user is part of

// Arguments:
// authUserId (integer) - User ID of the user listing the channels

// Return Values:
// Returns {channels: []} on invalid authUserId
// Returns {channels: [{
//                        channelId: <ID of channel>,
//                        name: <name of channel> },] } on valid inputs


function channelsListV1(authUserId) {
  
  let data = getData();
  let validId = false;
  let flag = 0;
  
  // Validates the authUserId Passed
  for(let i = 0; i < data.user.length; i++) {
    if(data.user[i].userId === authUserId.authUserId) {
      validId = true;
      flag = i;
    }
  }
  
  if(validId === false) {
    return {
      channels: []
    };
  }
  
  let storeChannels = {channels: []};
  
  for(let j = 0; j < data.user[flag].channels.length; j++) {
    let channelId = data.user[flag].channels[j];
    
    for(let k = 0; k < data.channel.length; k++) {
      if(channelId === data.channel[k].cId) {
        storeChannels.channels.push({channelId: data.channel[k].cId,
                                     name: data.channel[k].name});
        break;
      }
    }
  }
  
  return storeChannels;
}

// Function to list all channels with their details

// Arguments:
// authUserId (integer) - User ID of the user listing the channels

// Return Values:
// Returns {channels: []} on invalid authUserId
// Returns {channels: [{
//                        channelId: <ID of channel>,
//                        name: <name of channel> },] } on valid inputs

function channelsListallV1(authUserId) {
  
  let data = getData();
  let validId = false;
  let flag = 0;
  
  // Validates the authUserId Passed
  for(let i = 0; i < data.user.length; i++) {
    if(data.user[i].userId === authUserId.authUserId) {
      validId = true;
      flag = i;
    }
  }
  
  if(validId === false) {
    return {
      channels: []
    };
  }
  
  let storeChannels = {channels: []};

  for(let j = 0; j < data.channel.length; j++) {
    storeChannels.channels.push({channelId: data.channel[j].cId,
                                 name: data.channel[j].name});
  }
  
  return storeChannels;
}

export { channelsCreateV1, channelsListV1, channelsListallV1 };
