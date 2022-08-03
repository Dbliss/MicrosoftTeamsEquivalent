import console from 'console';
import { getData, setData, channelType, usersType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

type returnObjectType = {
  name: string,
  isPublic: boolean,
  ownerMembers: usersType[],
  allMembers: usersType[],
};

type tempMembersType = {
  email: string,
    handleStr: string,
    nameFirst: string,
    nameLast: string,
    uId: number,
};

// type errorType = {
//   error: string;
// };

// Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.

// Arguments:
// authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
// channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return Value:
// Returns <{name, isPublic, ownerMembers, allMembers}> on <valid input of authUserId and channelId>
// Returns <{error: error}> on <channelId does not refer to a valid channel>
// Returns <{error: error}> on <when channelId is invalid>
// Returns <{error: error}> on <authorised user is not a member of the channel>

function channelDetailsV1 (token: string, channelId: number) {
  const data = getData();

  // const error: errorType = { error: 'error' };

  // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const userIndex = getTokenIndex(token, data);
  // code adapted from the website shorturl.at/eoJKY

  // The code finds the index of the object which contains the apropriate channelId, in the channel key array,
  // and stores it within a variable. If not found -1 is stored
  const channelIndex = data.channel.findIndex((object: any) => {
    return object.cId === channelId;
  });

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if ((userIndex === -1)) {
    throw HTTPError(403, 'Invalid token');
  }

  if ((channelIndex === -1)) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // returns the index of the channelId in the channels array of the valid user
  // if the channel is not within the user's channels array then -1 is returned
  const cIdIndex = data.user[userIndex].channels.findIndex((object: any) => {
    return object.cId === channelId;
  });

  // when the user is not a part of the channel error onject is returned
  if (cIdIndex === -1) {
    throw HTTPError(403, 'Valid channelId but user is not part of channel');
  }

  // store relevant information from the user into a return object
  const returnObject: returnObjectType = {
    name: '',
    isPublic: false,
    ownerMembers: [],
    allMembers: []
  };

  returnObject.name = data.channel[channelIndex].name;
  returnObject.isPublic = data.channel[channelIndex].isPublic;

  let tempMembers: tempMembersType[] = [];

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

function channelJoinV1 (token: string, channelId: number) {
  const data = getData();
  const returnObject = {};
  // const error = { error: 'error' };

  // The code finds the index of the object which contains the apropriate channelId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const channelIndex = data.channel.findIndex((object: any) => {
    return object.cId === channelId;
  });

  // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const userIndex = getTokenIndex(token, data); // code adapted from the website shorturl.at/eoJKY

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if (userIndex === -1) {
    throw HTTPError(403, 'Invalid token');
  }
  if ((userIndex === -1) || (channelIndex === -1)) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // Check to see if new user is a member
  let isGlobalMember = 0;
  if (data.user[userIndex].permissionId === 1) {
    isGlobalMember = 1;
  }

  // Loops through the array members in the specified channel and checks
  // whether the authorised user is already a member of the channel,
  // if they are then error object is returned

  const currentMember = data.user[userIndex].channels.findIndex((object: any) => { // I think this works need to test
    // further
    return object.cId === data.channel[channelIndex].cId;
  });

  if (currentMember !== -1) {
    throw HTTPError(400, 'Already member of the channel');
  }

  // for (let i = 0; i < data.channel[channelIndex].members.length; i++) {
  //   if (data.channel[channelIndex].members[i].authUserId === authUserId) {
  //     return error;
  //   }
  // }

  // checking if the channel is public or not if not true then error is returned
  const isPublic = data.channel[channelIndex].isPublic;
  // if member is not a global owner and channel is private then return error
  console.log(data);
  if (isPublic === false && isGlobalMember === 0) {
    throw HTTPError(403, 'Not a global owner joining private channel');
  }

  const addingChannel = { cId: channelId, channelPermissionsId: 2 };

  // checking if the owner is a global owner and updating permissions if they are
  if (isGlobalMember === 1) {
    addingChannel.channelPermissionsId = 1;
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

function channelInviteV2(token: string, channelId: number, uId: number) {
  // getting the dataset
  const data:dataType = getData();

  let validChannel = false;
  let validUid = false;

  let currentChannel: channelType;

  // if no channels have been created return an error
  if (JSON.stringify(data.channel) === JSON.stringify([])) {
    throw HTTPError(400, 'channelId does not refer to a valid channel');
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
    if (user.authUserId === uId) {
      validUid = true;
    }
  }

  // checking valid inputted channelId and uId
  if (validChannel === false) {
    throw HTTPError(400, 'channelId does not refer to a valid channel');
  }

  if (validUid === false) {
    throw HTTPError(400, 'uId does not refer to a valid user');
  }

  // checking that the uId isnt already in the channel
  let flag = 0;
  for (const member of currentChannel.members) {
    if (member.authUserId === uId) {
      throw HTTPError(400, 'uId is already a member of the channel');
    }
    for (const tokenn of member.token) {
      if (tokenn === token) {
        flag = 1;
      }
    }
  }

  // checking the user with token is apart of the channel
  if (flag === 0) {
    throw HTTPError(403, 'authorised user is not a member of the channel');
  }

  // need to find which user uId is
  let j = -1;
  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].authUserId === uId) {
      j = i;
      const pushObject = { cId: channelId, channelPermissionsId: 2 };
      data.user[i].channels.push(pushObject);
    }
  }

  // need to find which channel channelId is
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      data.channel[i].members.push(data.user[j]);
    }
  }

  // Adding notifications to added user
  const userIndex = getTokenIndex(token, data);
  for (const user in data.user) {
    if (data.user[user].authUserId === uId) {
      data.user[user].notifications.push({
        channelId: channelId,
        dmId: -1,
        notificationMessage: data.user[userIndex].handle + ' added you to ' + currentChannel.name,
        type: 3
      });
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

function channelMessagesV2 (token: string, channelId: number, start: number) {
  // getting the dataset
  const data:dataType = getData();

  let currentChannel: channelType;
  const messages = [];

  // if no channels have been created return an error
  if (data.channel.length === 0) {
    throw HTTPError(400, 'channelId does not refer to a valid channel');
  }

  // checking the channelId is valid and setting currentChannel to the valid channel
  let validChannel = false;
  for (const channel of data.channel) {
    if (channel.cId === channelId) {
      validChannel = true;
      currentChannel = channel;
    }
  }

  // checking valid inputted channelId
  if (validChannel === false) {
    throw HTTPError(400, 'channelId does not refer to a valid channel');
  }

  // checking that start is not greater than the total number of messages in the channel
  if (currentChannel.messages.length < start) {
    throw HTTPError(400, 'start is greater than the total number of messages in the channel');
  }

  // checking the user with token is apart of the channel
  let flag = 0;
  for (const member of currentChannel.members) {
    for (const tokenn of member.token) {
      if (tokenn === token) {
        flag = 1;
      }
    }
  }
  if (flag === 0) {
    throw HTTPError(403, 'authorised user is not a member of the channel');
  }

  const user = getTokenIndex(token, data);
  const uId = data.user[user].authUserId;

  let j = 0;
  for (let i = start; i < currentChannel.messages.length && j < 50; i++) {
    if (currentChannel.messages[i].reacts[0] !== undefined) {
      for (const user of currentChannel.messages[i].reacts[0].uIds) {
        if (user === uId) {
          currentChannel.messages[i].reacts[0].isThisUserReacted = true;
        }
      }
    }
    messages[j] = currentChannel.messages[i];
    j++;
  }

  let end = start + 50;

  if (j !== 50) {
    end = -1;
  }

  return { messages, start, end };
}

// Given a channel with ID channelId that the authorised user is a member of, remove them as a member of the channel
// Arguments:
// token (string) - This is the token string allocated to the user which is used when trying to leave the channel
// channelId (number) - This is channelId of the channel the user is trying to leave

// Return Values:
// Returns {} (object) on valid channelLeaveV1
// Returns { error: 'error' } on invalid token
// Returns { error: 'error' } on invalid channelId
// Returns { error: 'error' } on authorised user not being part of channel

const channelLeaveV1 = (token: string, channelId: number) => {
  const data:dataType = getData();
  const userIndex = getTokenIndex(token, data);
  if (userIndex === -1) {
    throw HTTPError(403, 'Invalid token');
  }
  const authUserId = data.user[userIndex].authUserId;
  // check to see if channelId is valid
  let isChannelIdValid = false;
  let channelIndex = -1;
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      isChannelIdValid = true;
      channelIndex = i;
    }
  }
  if (isChannelIdValid === false) {
    throw HTTPError(400, 'Invalid channel Id');
  }

  // check to see if member is in channel
  let isMemberValid = false;
  let memberIndex = -1;
  for (let j = 0; j < data.channel[channelIndex].members.length; j++) {
    if (data.channel[channelIndex].members[j].authUserId === authUserId) {
      isMemberValid = true;
      memberIndex = j;
    }
  }
  if (isMemberValid === false) {
    throw HTTPError(403, 'Authorised user not member of channel');
  }
  // remove user as member of channel
  if (memberIndex > -1) {
    data.channel[channelIndex].members.splice(memberIndex, 1);
    for (let i = 0; i < data.user[userIndex].channels.length; i++) {
      if (data.user[userIndex].channels[i].cId === channelId) {
        data.user[userIndex].channels.splice(i, 1);
      }
    }
    setData(data);
  }
  return {};
};

// Make user with user id uId an owner of the channel.
// Arguments:
// token (string) - This is the token string allocated to the user when trying to add user as owner of channel
// channelId (number) - This is channelId of the channel the user is trying to be an owner of
// uId (number) - This is the user Id of the user when trying to add user as owner of channel

// Return Values:
// Returns {} (object) on valid channelAddOwnerV1
// Returns { error: 'error' } on invalid token
// Returns { error: 'error' } on invalid channelId
// Returns { error: 'error' } on invalid uId
// Returns { error: 'error' } on user not being a member of channel
// Returns { error: 'error' } on user already being owner of channel
// Returns { error: 'error' } on authorised user not having owner permissions

const channelAddOwnerV1 = (token: string, channelId: number, uId: number) => {
  const data:dataType = getData();

  // Checking if token is valid and taking out the userId of the user
  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid Token');
  }

  // check if valid channel id
  let isChannelIdValid = false;
  let channelIndex = -1;
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      isChannelIdValid = true;
      channelIndex = i;
    }
  }
  if (isChannelIdValid === false) {
    throw HTTPError(400, 'Invalid channel Id');
  }
  // check if uId is valid
  let isUserIdValid = false;
  for (let j = 0; j < data.user.length; j++) {
    if (data.user[j].authUserId === uId) {
      isUserIdValid = true;
    }
  }
  if (isUserIdValid === false) {
    throw HTTPError(400, 'Invalid user Id');
  }

  // check to see if member is in channel
  let isMemberValid = false;
  let memberIndex = -1;
  for (let k = 0; k < data.channel[channelIndex].members.length; k++) {
    if (data.channel[channelIndex].members[k].authUserId === uId) {
      isMemberValid = true;
      memberIndex = k;
    }
  }
  if (isMemberValid === false) {
    throw HTTPError(400, 'Member not in channel');
  }

  // user already an owner of channel
  for (let l = 0; l < data.channel[channelIndex].owners.length; l++) {
    if (data.channel[channelIndex].owners[l].authUserId === uId) {
      throw HTTPError(400, 'User already an owner of channel');
    }
  }

  // check to see if user has owner permissions
  for (let m = 0; m < data.user[tokenIndex].channels.length; m++) {
    if (data.user[tokenIndex].channels[m].cId === channelId) {
      if (data.user[tokenIndex].channels[m].channelPermissionsId === 2) {
        throw HTTPError(403, 'User does not have owner permissions');
      }
    }
  }

  // update channel permissions of newly added owner
  data.channel[channelIndex].members[memberIndex].permissionId = 1;

  // add user as owner of channel
  const newOwner = {
    authUserId: data.channel[channelIndex].members[memberIndex].authUserId,
    email: data.channel[channelIndex].members[memberIndex].email,
    nameFirst: data.channel[channelIndex].members[memberIndex].nameFirst,
    nameLast: data.channel[channelIndex].members[memberIndex].nameLast,
    handle: data.channel[channelIndex].members[memberIndex].handle,
    password: data.channel[channelIndex].members[memberIndex].password,
    channels: [...data.channel[channelIndex].members[memberIndex].channels],
    permissionId: data.channel[channelIndex].members[memberIndex].permissionId,
    token: [...data.channel[channelIndex].members[memberIndex].token],
    notifications: [...data.channel[channelIndex].members[memberIndex].notifications],
    resetCode: data.channel[channelIndex].members[memberIndex].resetCode
  };

  data.channel[channelIndex].owners.push(newOwner);
  setData(data);

  return {};
};

// Remove user with user id uId as an owner of the channel.
// Arguments:
// token (string) - This is the token string allocated to the user when trying to remove user as owner of channel
// channelId (number) - This is channelId of the channel the user is trying to be removed as an owner of
// uId (number) - This is the user Id of the user when trying to remove user as owner of channel

// Return Values:
// Returns {} (object) on valid channelRemoveOwnerV1
// Returns { error: 'error' } on invalid token
// Returns { error: 'error' } on invalid channelId
// Returns { error: 'error' } on invalid uId
// Returns { error: 'error' } on user not being an owner of channel
// Returns { error: 'error' } on user being only owner of channel
// Returns { error: 'error' } on authorised user not having owner permissions

const channelRemoveOwnerV1 = (token: string, channelId: number, uId: number) => {
  const data:dataType = getData();

  // Checking if token is valid and taking out the userId of the user
  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  // check if valid channel id
  let isChannelIdValid = false;
  let channelIndex = -1;
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      isChannelIdValid = true;
      channelIndex = i;
    }
  }
  if (isChannelIdValid === false) {
    throw HTTPError(400, 'Invalid channel Id');
  }
  // check if uId is valid
  let isUserIdValid = false;
  for (let j = 0; j < data.user.length; j++) {
    if (data.user[j].authUserId === uId) {
      isUserIdValid = true;
    }
  }
  if (isUserIdValid === false) {
    throw HTTPError(400, 'Invalid user Id');
  }

  // check to see if owner is in channel
  let isOwnerValid = false;
  let ownerIndex = -1;
  for (let k = 0; k < data.channel[channelIndex].owners.length; k++) {
    if (data.channel[channelIndex].owners[k].authUserId === uId) {
      isOwnerValid = true;
      ownerIndex = k;
    }
  }
  if (isOwnerValid === false) {
    throw HTTPError(400, 'Owner is not in channel');
  }

  // user only owner in channel
  if (data.channel[channelIndex].owners.length === 1) {
    throw HTTPError(400, 'User is only owner in channel');
  }

  // check to see if user has owner permissions
  for (let m = 0; m < data.user[tokenIndex].channels.length; m++) {
    if (data.user[tokenIndex].channels[m].cId === channelId) {
      if (data.user[tokenIndex].channels[m].channelPermissionsId === 2) {
        throw HTTPError(403, 'User does not have owner permissions');
      }
    }
  }

  // update channel permissions of newly added owner
  let memberIndex = -1;
  for (let k = 0; k < data.channel[channelIndex].members.length; k++) {
    if (data.channel[channelIndex].members[k].authUserId === uId) {
      memberIndex = k;
    }
  }
  data.channel[channelIndex].members[memberIndex].permissionId = 2;

  // remove owner from array
  if (ownerIndex > -1) {
    data.channel[channelIndex].owners.splice(ownerIndex, 1);
    setData(data);
  }
  return {};
};

export { channelDetailsV1, channelJoinV1, channelInviteV2, channelMessagesV2, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1 };
