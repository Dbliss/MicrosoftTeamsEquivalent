
import { channelType, getData, setData, channelsType } from './dataStore';

type storeChannelsType = {
  channels: channelsType[],
};

// Function to create a new channel with the passed name and assign if it is public or not. User(authUserId) is added to the channel by default

// Arguments:
// authUserId (integer) - User ID of the user creating the channel
// name (string) - Name of the new channel
// isPublic (boolean) - States if channel is public or private

// Return Values:
// Returns {channelId: <channelId>} (integer) on valid authUserId and name
// Returns {error: 'error'} on invalid authUserId - Being authUserId does not exist
// Returns {error: 'error'} on invalid name - name must be in between 1 and 20 characters inclusive

function channelsCreateV1(token: string, name: string, isPublic: boolean) {
  const data = getData();

  // Checking if token is valid and taking out the userId of the user
  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  // Returns error message when token or name is invalid
  if (validToken === 0 || name.length < 1 || name.length > 20) {
    return { error: 'error' };
  }

  // New channel to be saved in data
  const newChannel: channelType = {
    cId: Math.floor(Math.random() * Date.now()),
    name: name,
    isPublic: isPublic,
    owners: [data.user[flag]],
    members: [data.user[flag]],
    messages: []
  };

  data.channel.push(newChannel);
  // Saving channel information of the channel user is part of in the user data 
  const pushObject = {
    cId: newChannel.cId,
    channelPermissionsId: 1
  };
  data.user[flag].channels.push(pushObject);

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

function channelsListV1(token: string) {
  const data = getData();

  // Checking if token is valid and taking out the userId of the user
  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  // return empty channel if the token is invalid
  if (validToken === 0) {
    return {
      channels: []
    };
  }

  // Loop through the channels and save the ones user is part of in an array
  const storeChannels:storeChannelsType = { channels: [] };
  for (let j = 0; j < data.user[flag].channels.length; j++) {
    const channelId = data.user[flag].channels[j].cId;

    for (let k = 0; k < data.channel.length; k++) {
      if (channelId === data.channel[k].cId) {
        storeChannels.channels.push({
          channelId: data.channel[k].cId,
          name: data.channel[k].name
        });
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

function channelsListallV1(token: string) {
  const data = getData();

  // Checking if token is valid and taking out the userId of the user
  let validToken = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
      }
    }
  }

  if (validToken === 0) {
    return {
      channels: []
    };
  }

  // Loop though data to store all the channels in a array
  const storeChannels: storeChannelsType = { channels: [] };
  for (let j = 0; j < data.channel.length; j++) {
    storeChannels.channels.push({
      channelId: data.channel[j].cId,
      name: data.channel[j].name
    });
  }

  return storeChannels;
}

export { channelsCreateV1, channelsListV1, channelsListallV1 };
