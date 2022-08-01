import { getData, setData, channelType, messageType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';
import { getHashOf } from './other';

function messageSendV1(token: string, channelId: number, message: string) {
  const data:dataType = getData();
  let currentChannel: channelType;

  // checking the channelId is valid and setting currentChannel to the valid channel
  let validChannel = false;
  for (const channel of data.channel) {
    if (channel.cId === channelId) {
      validChannel = true;
      currentChannel = channel;
    }
  }
  if (validChannel === false) {
    return { error: 'error' };
  }

  const userIndex = getTokenIndex(token, data);
  // checking the token is valid
  if (userIndex === -1) {
    return { error: 'error' };
  }

  // chekcing the length of the message is within parameters
  if (message.length > 1000 || message.length < 1) {
    return { error: 'error' };
  }

  let uId = 0;
  let flag = -1;
  for (const member of currentChannel.members) {
    for (const tokenn of member.token) {
      if (tokenn === getHashOf(token)) {
        flag = 1;
        uId = member.authUserId;
      }
    }
  }
  if (flag === -1) {
    return { error: 'error' };
  }

  // generating the messageId
  const messageId = Math.floor(Math.random() * Date.now());

  // generating the timeSent
  const timeSent = Math.floor(Date.now() / 1000);

  // creating a new object for the message
  const newMessage: messageType = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: timeSent
  };

  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      data.channel[i].messages.push(newMessage);
    }
  }
  // storing the new message into the data

  setData(data);

  return { messageId };
}

function messageEditV1(token: string, messageId: number, message: string) {
  const data: dataType = getData();
  console.log(messageId);
  const tokenIndex = getTokenIndex(token, data);
  // checking the token is valid
  if (tokenIndex === -1) {
    return { error: 'error' };
  }
  let isDmMember = false;
  let isDmOwner = false;
  let isOwnerMember = false;
  let userIndex = 0;
  let userId = 0;
  let isMemberOfChannel = false;
  let tokenIsSender = false;

  // finding the checking if the token user has global permissions
  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].token[tokenIndex] === getHashOf(token)) {
      userIndex = i;
      userId = data.user[i].authUserId;
    }
  }

  // checking if the token user

  // checking the length of the message is within parameters
  if (message.length > 1000) {
    return { error: 'error' };
  }

  // checking delete condition
  let deleteCondition = false;
  if (message.length === 0) {
    deleteCondition = true;
  }
  let uId = 0;
  let timeSent = 0;

  // Need to check if the message is a dm or channel message
  let isDmMessage = false;
  let isChannelMessage = false;

  // checking the messageId refers to a real channel message
  let validMessageId = false;

  for (let i = 0; i < data.channel.length; i++) {
    for (const message of data.channel[i].messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
        uId = message.uId;
        timeSent = message.timeSent;
        isChannelMessage = true;
        // checking if the token is the sender
        if (uId === userId) {
          tokenIsSender = true;
        }
        // checking the user is in the channel
        for (let j = 0; j < data.channel[i].members.length; j++) {
          if (data.channel[i].members[j].authUserId === userId) {
            isMemberOfChannel = true;
            // need to check if the user has owner permissions in this channel
            for (const channel of data.user[userIndex].channels) {
              if (channel.cId === data.channel[i].cId) {
                if (channel.channelPermissionsId === 1) {
                  isOwnerMember = true;
                }
              }
            }
          }
        }
        break;
      }
    }
  }

  // checking the messageId refers to a real dm message
  for (let i = 0; i < data.dm.length; i++) {
    for (const message of data.dm[i].messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
        uId = message.uId;
        timeSent = message.timeSent;
        isDmMessage = true;
        // checking if the token is the sender
        if (uId === userId) {
          tokenIsSender = true;
        }
        // check if the token user is a member of channel
        for (const member of data.dm[i].members) {
          if (member === userId) {
            isDmMember = true;
          }
        }
        // check is token user is a owner of channel
        for (const owner of data.dm[i].owners) {
          if (owner === userId) {
            isDmOwner = true;
          }
        }
        break;
      }
    }
  }

  if (tokenIsSender === false) {
    if (isDmMessage === true) {
      if (isDmMember === false || isDmOwner === false) {
        return { error: 'error' };
      }
    } else if (isChannelMessage === true) {
      if (isMemberOfChannel === false) {
        return { error: 'error' };
      } else if (isMemberOfChannel === true) {
        if (isOwnerMember === false) {
          return { error: 'error' };
        }
      }
    }
  }

  if (validMessageId === false) {
    return { error: 'error' };
  }

  const newMessage: messageType = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: timeSent,
  };

  // editing the message for the channel case
  if (isChannelMessage === true) {
    let key1 = -1;
    for (let i = 0; i < data.channel.length; i++) {
      for (let j = 0; i < data.channel[i].messages.length; j++) {
        if (data.channel[i].messages[j].messageId === messageId) {
          key1 = i;
          newMessage.uId = data.channel[i].messages[j].uId;
          newMessage.timeSent = data.channel[i].messages[j].timeSent;
          deleteCondition === true ? data.channel[i].messages.splice(j, 1) : data.channel[i].messages.splice(j, 1, newMessage);
          break;
        }
      }
    }

    // checking the user is a member of the channel
    let flag = 0;
    for (const member of data.channel[key1].members) {
      for (const tokenn of member.token) {
        if (tokenn === getHashOf(token)) {
          flag = 1;
        }
      }
    }
    if (flag === 0) {
      return { error: 'error' };
    }
  }
  // editing the message for the dm case
  if (isDmMessage === true) {
    for (let i = 0; i < data.dm.length; i++) {
      for (let j = 0; i < data.dm[i].messages.length; j++) {
        if (data.dm[i].messages[j].messageId === messageId) {
          newMessage.uId = data.dm[i].messages[j].uId;
          newMessage.timeSent = data.dm[i].messages[j].timeSent;
          deleteCondition === true ? data.dm[i].messages.splice(j, 1) : data.dm[i].messages.splice(j, 1, newMessage);
          break;
        }
      }
    }
  }
  setData(data);
  return {};
}

function messageRemoveV1(token: string, messageId: number) {
  const data = getData();
  let uId = 0;
  const tokenIndex = getTokenIndex(token, data);
  // checking the token is valid
  if (tokenIndex === -1) {
    return { error: 'error' };
  }

  // need to find the authUserId of the token
  uId = data.user[tokenIndex].authUserId;

  // Need to check if the message is a dm or channel message
  let isDmMessage = false;
  let isChannelMessage = false;
  let isOwnerMember = false;
  let isMessageSender = false;
  let isApartOfChannelOrDm = false;

  // checking the messageId refers to a real message in a channel
  let validMessageId = false;
  for (let i = 0; i < data.channel.length; i++) {
    for (const message of data.channel[i].messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
        isChannelMessage = true;
        // checking the channel contains the person calling the function
        if (data.channel[i].members.includes(uId) === true) {
          isApartOfChannelOrDm = true;
        }
        // checking the person calling the function is a owner of the channel
        if (data.channel[i].owners.includes(uId) === true) {
          isOwnerMember = true;
        }
        // checking the if the person calling the function sent the original message
        if (uId === message.uId) {
          isMessageSender = true;
        }
      }
    }
  }
  let flag = 0;
  // checking the messageId refers to a real message in a dm
  for (let i = 0; i < data.dm.length; i++) {
    for (const message of data.dm[i].messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
        isDmMessage = true;
        // checking the if the person calling the function sent the original message
        if (uId === message.uId) {
          isMessageSender = true;
        }
        // checking the dm contains the person calling the function
        if (data.dm[i].members.includes(uId) === true) {
          isApartOfChannelOrDm = true;
        }
        // checking the person calling the function is a owner of the channel
        if (data.dm[i].owners.includes(uId) === true) {
          isOwnerMember = true;
        }
        flag = i;
      }
    }
  }

  const re = data.dm[flag];
  if (isMessageSender === false) {
    if (isDmMessage === true) {
      if (isApartOfChannelOrDm === false || isOwnerMember === false) {
        return { re, uId };
      }
    } else if (isChannelMessage === true) {
      if (isApartOfChannelOrDm === false) {
        return { error: 'error' };
      } else if (isApartOfChannelOrDm === true) {
        if (isOwnerMember === false) {
          return { error: 'error' };
        }
      }
    }
  }

  if (validMessageId === false) {
    return { error: 'error' };
  }

  if (isChannelMessage === true) {
    for (let i = 0; i < data.channel.length; i++) {
      for (let j = 0; i < data.channel[i].messages.length; j++) {
        if (data.channel[i].messages[j].messageId === messageId) {
          if (data.channel[i].owners.includes(uId) === true) {
            isOwnerMember = true;
          }
          data.channel[i].messages.splice(j, 1);
          break;
        }
      }
    }
  }

  if (isDmMessage === true) {
    for (let i = 0; i < data.dm.length; i++) {
      for (let j = 0; i < data.dm[i].messages.length; j++) {
        if (data.dm[i].messages[j].messageId === messageId) {
          data.dm[i].messages.splice(j, 1);
          break;
        }
      }
    }
  }
  setData(data);
  return {};
}

function messageSenddmV2 (token: string, dmId: number, message: string) {
  const data:dataType = getData();

  // checking the token is valid
  const flag = getTokenIndex(token, data);
  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const uId = data.user[flag].authUserId;

  // Return error if message is not of valid length
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'Invalid Message');
  }

  // Validates dmId and if user is part of dm
  let validDmId = 0;
  let isMember = 0;
  let looper = 0;
  let dmIndex = 0;
  for (const dm of data.dm) {
    if (dm.dmId === dmId) {
      validDmId = 1;
      dmIndex = looper;
      for (const member of dm.members) {
        if (member === data.user[flag].authUserId) {
          isMember = 1;
        }
      }
    }
    looper++;
  }

  // Returns error if dmId or user is invaid
  if (validDmId === 0) {
    throw HTTPError(400, 'Invalid dmId');
  }
  if (isMember === 0) {
    throw HTTPError(403, 'Not a Member');
  }

  const tempMessage = {
    messageId: Math.floor(Math.random() * Date.now()),
    uId: uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
  };

  data.dm[dmIndex].messages.push(tempMessage);

  setData(data);
  return { messageId: tempMessage.messageId };
}

export { messageSendV1, messageRemoveV1, messageEditV1, messageSenddmV2 };
