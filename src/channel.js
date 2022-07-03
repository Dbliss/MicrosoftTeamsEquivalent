import { getData, setData } from './dataStore.js';

// Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.

// Arguments:
// authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
// channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return Value:
// Returns <{name, isPublic, ownerMembers, allMembers}> on <valid input of authUserId and channelId>
// Returns <{error: error}> on <channelId does not refer to a valid channel>
// Returns <{error: error}> on <when channelId is invalid>
// Returns <{error: error}> on <authorised user is not a member of the channel>

function channelDetailsV1 (authUserId, channelId) {
  const data = getData();

  const error = { error: 'error' };

  // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const userIndex = data.user.findIndex(object => {
    return object.authUserId === authUserId;
  });
    // code adapted from the website shorturl.at/eoJKY

  // The code finds the index of the object which contains the apropriate channelId, in the channel key array,
  // and stores it within a variable. If not found -1 is stored
  const channelIndex = data.channel.findIndex(object => {
    return object.cId === channelId;
  });

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if ((userIndex === -1) || (channelIndex === -1)) {
    return error;
  }

  // returns the index of the channelId in the channels array of the valid user
  // if the channel is not within the user's channels array then -1 is returned
  const cIdIndex = data.user[userIndex].channels.findIndex(object => {
    return object.cId === channelId;
  });

  // when the user is not a part of the channel error onject is returned
  if (cIdIndex === -1) {
    return error;
  }

  // store relevant information from the user into a return object
  const returnObject = {};
  returnObject.name = data.channel[channelIndex].name;
  returnObject.isPublic = data.channel[channelIndex].isPublic;

  let tempMembers = [];

  const channelOwners = data.channel[channelIndex].owners;

  // Receives all appropriate information from the owners array of user objects and stores them in a
  // object which is pushed to the end of a temporary array tempMembers
  for (let i = 0; i < data.channel[channelIndex].owners.length; i++) {
    tempMembers.push({
      email: channelOwners[i].email,
      handleStr: channelOwners[i].handle,
      nameFirst: channelOwners[i].nameFirst,
      nameLast: channelOwners[i].nameLast,
      uId: channelOwners[i].authUserId,
    });
  }

  // setting the array of ownerMembers in the return object to the
  // tempMembers array
  returnObject.ownerMembers = tempMembers;

  // tempMembers is reset to empty
  tempMembers = [];

  const channelMembers = data.channel[channelIndex].members;

  // Receives all appropriate information from the members array of user objects and stores them in a
  // object which is pushed to the end of a temporary array tempMembers
  for (let j = 0; j < data.channel[channelIndex].members.length; j++) {
    tempMembers.push({
      email: channelMembers[j].email,
      handleStr: channelMembers[j].handle,
      nameFirst: channelMembers[j].nameFirst,
      nameLast: channelMembers[j].nameLast,
      uId: channelMembers[j].authUserId,
    });
  }

  // setting the array of allMembers in the return object to the
  // tempMembers array
  returnObject.allMembers = tempMembers;

  return returnObject;
}

// Given a channelId of a channel that the authorised user can join, adds them to that channel.

// Arguments:
// <authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
// <channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return Value:
// Returns {} on <valid input of authUserId and channelId>
// Returns {error: error} on channelId does not refer to a valid channel,
// Returns {error: error} on the authorised user is already a member of the channel

function channelJoinV1 (authUserId, channelId) {
  const data = getData();
  const returnObject = {};
  const error = { error: 'error' };

  // The code finds the index of the object which contains the apropriate channelId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const channelIndex = data.channel.findIndex(object => {
    return object.cId === channelId;
  });

  // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const userIndex = data.user.findIndex(object => {
    return object.authUserId === authUserId;
  }); // code adapted from the website shorturl.at/eoJKY

  // Check to see if new user is a member
  let isGlobalMember = 0;
  if (data.user[userIndex].permissionId === 1) {
    isGlobalMember = 1;
  }

  // Loops through the array members in the specified channel and checks
  // whether the authorised user is already a member of the channel,
  // if they are then error object is returned
  for (let i = 0; i < data.channel[channelIndex].members.length; i++) {
    if (data.channel[channelIndex].members[i].authUserId === authUserId) {
      return error;
    }
  }

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if ((userIndex === -1) || (channelIndex === -1)) {
    return error;
  }

  // checking if the channel is public or not if not true then error is returned
  const isPublic = data.channel[channelIndex].isPublic;
  // if member is not a global owner and channel is private then return error
  if (isPublic === false && isGlobalMember === 0) {
    return error;
  }

  const addingChannel = { cId: channelId, channelPermissionId: 2 };

  // checking if the owner is a global owner and updating permissions if they are
  if (isGlobalMember === 1) {
    addingChannel.channelPermissionId = 1;
  }

  // setting the push object to the user needs to be added to the members array for
  // the particular channel
  const pushObject = data.user[userIndex];

  // User is able to join the channel and so members is updated within the channel's
  // member array and channels list is updated within the user's channels array
  data.user[userIndex].channels.push(addingChannel);
  data.channel[channelIndex].members.push(pushObject);

  // updating the data in the data storage file
  setData(data);

  return returnObject;
}

// Invites a user with ID uId to join a channel with ID channelId. Once invited, the user is added
//  to the channel immediately. In both public and private channels, all members are able to invite users.

// Arguments:
// authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
// channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>
// uId> (<integer>)    - <This is the unique ID given to a a user once they are registered. It is the same as the users authUserId>

// Return Value:
// Returns <{}> on <valid input of authUserId, channelId and uId>
// Returns <{error: error}> on channelId does not refer to a valid channel,
// Returns <{error: error}> when uId does not refer to a valid user
// Returns <{error: error}> when uId refers to a user who is already a member of the channel
// Returns <{error: error}> on authorised user is not a member of the channel

function channelInviteV1(authUserId, channelId, uId) {
  // getting the dataset
  const data = getData();

  let validChannel = false;
  let validUid = false;

  let currentChannel = {};

  // if no channels have been created return an error
  if (JSON.stringify(data.channel) === JSON.stringify([])) {
    return { error: 'error' };
  }

  // checking the channelId is valid and setting currentChannel to the valid channel
  for (const channel of data.channel) {
    if (channel.cId === channelId) {
      validChannel = true;
      currentChannel = channel;
    }
  }

  // checking the uId is valid
  for (const user of data.user) {
    if (user === uId) {
      validUid = true;
    }
  }

  // checking valid inputted channelId and uId
  if (validChannel === false || validUid === false) {
    return { error: 'error' };
  }

  // checking that the uId isnt already in the channel
  if (currentChannel.members.includes(uId) === true) {
    return { error: 'error' };
  }

  // checking the authUserId is apart of the channel
  if (currentChannel.members.includes(authUserId) === false) {
    return { error: 'error' };
  }

  // need to find which user uId is
  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].authUserId === uId) {
      const j = i;
      let isGlobalMember = 2;
      if (data.user[j].permissionId === 1) {
        isGlobalMember = 1;
      }
      const pushObject = { cId: channelId, channelPermissionId: isGlobalMember };
      data.user[i].channels.push(pushObject);
    }
  }

  // need to find which channel channelId is
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      data.channel[k].members.push(data.user[j]);
    }
  }

  setData(data);

  return { };
}

// Given a channel with ID channelId that the authorised user is a member of, return
// up to 50 messages between index "start" and "start + 50".

// Arguments:
// authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
// channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>
// start> (<integer>)    - <This is an integer given from the user>

// Return Value:
// Returns <{ messages, start, end}> on <valid input of authUserId, channelId and uId>
// Returns <{error: error}> on channelId does not refer to a valid channel,
// Returns <{error: error}> start is greater than the total number of messages in the channel
// Returns <{error: error}> on authorised user is not a member of the channel

function channelMessagesV1 (authUserId, channelId, start) {
  // getting the dataset
  const data = getData();

  let currentChannel = {};
  const messages = [];

  // if no channels have been created return an error
  if (data.channel.length === 0) {
    return { error: 'error' };
  }

  // checking the channelId is valid and setting currentChannel to the valid channel
  let validChannel = false;
  for (const channel of data.channel) {
    if (channel.cId === channelId) {
      validChannel = true;
      currentChannel = channel;
    }
  }

  // checking valid inputted channelId and uId
  if (validChannel === false) {
    return { error: 'error' };
  }

  // checking that start is not greater than the total number of messages in the channel
  if (currentChannel.messages.length < start) {
    return { error: 'error' };
  }

  // checking the authUserId is a member of the channel
  let flag = false;
  for (const user of data.user) {
    if (user.authUserId === authUserId) {
      /* if (user.channels.includes(channelId) === false) {
                return {error: 'error'};
            } */

      for (const channel of user.channels) {
        if (channel.cId === channelId) {
          flag = true;
        }
      }
    }
  }
  if (flag === false) {
    return { error: 'error' };
  }

  let j = 0;
  for (let i = start; i < currentChannel.messages.length && j < 50; i++) {
    messages[j] = currentChannel.messages[i];
    j++;
  }

  let end = start + 50;

  if (j !== 50) {
    end = -1;
  }

  return { messages, start, end };
}

export { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1 };
