import { getData, setData, channelType, messageType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';
/**
 * <Function creates and sends a message to a specific channel>
 *
 * Arugments:
 * <token> is a <string> and is a users session specific identity
 * <channelId> is a <number> and is a channels specific identity
 * <message> is a <string> and is the message that the user wants to send in the channel
 *
 * Return Value:
 * <400 Error> when <channelId does not refer to a valid channel>
 * <400 Error> when <length of message is less than 1 or over 1000 characters>
 * <400 Error> when <token refers to an invalid token>
 * <403 Error> when <channelId is valid and the authorised user is not a member of the channel>
 * <{ messageId }> when <everything is inputted correctly>
 *
 */
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
    throw HTTPError(400, 'Invalid channel Id');
  }

  const userIndex = getTokenIndex(token, data);
  // checking the token is valid
  if (userIndex === -1) {
    throw HTTPError(400, 'Token is invalid');
  }

  // chekcing the length of the message is within parameters
  if (message.length > 1000 || message.length < 1) {
    throw HTTPError(400, 'Length of message is too short or too long');
  }

  let uId = 0;
  let flag = -1;
  for (const member of currentChannel.members) {
    for (const tokenn of member.token) {
      if (tokenn === token) {
        flag = 1;
        uId = member.authUserId;
      }
    }
  }
  if (flag === -1) {
    throw HTTPError(403, 'Authorised user is not a member of the channel');
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
    timeSent: timeSent,
    reacts: [],
    isPinned: false
  };

  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      data.channel[i].messages.push(newMessage);
    }
  }
  // storing the new message into the data

  // Notification Sending to tagged people
  // Extracting tags from message
  const handles = [];
  for (let i = 0; i < message.length; i++) {
    if (message[i] === '@') {
      let handle = '';
      for (let j = i + 1; message[j] !== ' ' && message[j] !== '@'; j++) {
        handle = handle + message[j];
      }
      handles.push(handle);
    }
  }

  const userIndex2 = getTokenIndex(token, data);
  // Cutting message for notification
  const sedingMessage = message.slice(0, 20);
  // Sending the notification
  for (const handle of handles) {
    for (const user in data.user) {
      if (data.user[user].handle === handle) {
        data.user[user].notifications.push({
          channelId: channelId,
          dmId: -1,
          notificationMessage: data.user[userIndex2].handle + ' tagged you in ' + currentChannel.name + ': ' + sedingMessage,
          type: 1
        });
      }
    }
  }

  setData(data);

  return { messageId };
}

/**
 * <Function edits an already sent messaage into the message the user specifies>
 *
 * Arugments:
 * <token> is a <string> and is a users session specific identity
 * <messageId> is a <number> and is a messages specific identity
 * <message> is a <string> and is the message that the user wants to send in the channel
 *
 * Return Value:
 * <400 Error> when <messageId does not refer to a valid message within a channel/DM that the authorised user has joined>
 * <400 Error> when <length of message is over 1000 characters>
 * <400 Error> when <token refers to an invalid token>
 * <403 Error> when <If the authorised user does not have owner permissions, and the message was not sent by them>
 * <{}> when <everything is inputted correctly>
 */
function messageEditV1(token: string, messageId: number, message: string) {
  const data: dataType = getData();
  const tokenIndex = getTokenIndex(token, data);
  // checking the token is valid
  if (tokenIndex === -1) {
    throw HTTPError(400, 'Invalid token');
  }
  let uId = 0;
  let isDmMember = false;
  let isDmOwner = false;
  let isOwnerMember = false;
  let userId = 0;
  let isMemberOfChannel = false;
  let tokenIsSender = false;

  // finding the checking if the token user has global permissions
  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].token[tokenIndex] === token) {
      userId = data.user[i].authUserId;
    }
  }

  // checking the length of the message is within parameters
  if (message.length > 1000) {
    throw HTTPError(400, 'Message is too long');
  }

  // checking delete condition
  let deleteCondition = false;
  if (message.length === 0) {
    deleteCondition = true;
  }
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
          }
        }
        // need to check if the user has owner permissions in this channel
        for (let j = 0; j < data.channel[i].owners.length; j++) {
          if (data.channel[i].owners[j].authUserId === userId) {
            isOwnerMember = true;
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
        throw HTTPError(403, 'User did not send message, and is not a owner of the dm');
      }
    }
    if (isChannelMessage === true) {
      if (isMemberOfChannel === false) {
        throw HTTPError(403, 'User is not a member of the channel');
      }
      if (isMemberOfChannel === true) {
        if (isOwnerMember === false) {
          throw HTTPError(403, 'User did not send message, and is not a owner of the channel');
        }
      }
    }
  }

  if (validMessageId === false) {
    throw HTTPError(400, 'MessageId does not refer to a valid message');
  }

  const newMessage: messageType = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: timeSent,
    reacts: [],
    isPinned: false
  };

  // editing the message for the channel case
  if (isChannelMessage === true) {
    for (let i = 0; i < data.channel.length; i++) {
      for (let j = 0; i < data.channel[i].messages.length; j++) {
        if (data.channel[i].messages[j].messageId === messageId) {
          newMessage.uId = data.channel[i].messages[j].uId;
          newMessage.timeSent = data.channel[i].messages[j].timeSent;
          // checking the channel contains the person calling the function
          deleteCondition === true ? data.channel[i].messages.splice(j, 1) : data.channel[i].messages.splice(j, 1, newMessage);
          break;
        }
      }
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

/**
 * <Function deletes an already sent messaage>
 *
 * Arugments:
 * <token> is a <string> and is a users session specific identity
 * <messageId> is a <number> and is a messages specific identity
 *
 * Return Value:
 * <400 Error> when <messageId does not refer to a valid message within a channel/DM that the authorised user has joined>
 * <400 Error> when <token refers to an invalid token>
 * <403 Error> when <If the authorised user does not have owner permissions, and the message was not sent by them>
 * <{}> when <everything is inputted correctly>
 */
function messageRemoveV1(token: string, messageId: number) {
  const data = getData();
  let uId = 0;
  const tokenIndex = getTokenIndex(token, data);
  // checking the token is valid
  if (tokenIndex === -1) {
    throw HTTPError(400, 'Invalid token');
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
      }
    }
  }

  if (isMessageSender === false) {
    if (isDmMessage === true) {
      if (isApartOfChannelOrDm === false || isOwnerMember === false) {
        throw HTTPError(403, 'User did not send message, and is not a owner of the dm');
      }
    } else if (isChannelMessage === true) {
      if (isApartOfChannelOrDm === false) {
        throw HTTPError(403, 'User is not apart of channel');
      } else if (isApartOfChannelOrDm === true) {
        if (isOwnerMember === false) {
          throw HTTPError(403, 'User did not send message and is not owner of the channel');
        }
      }
    }
  }

  if (validMessageId === false) {
    throw HTTPError(400, 'messageId does not refer to a valid message');
  }

  if (isChannelMessage === true) {
    for (let i = 0; i < data.channel.length; i++) {
      for (let j = 0; i < data.channel[i].messages.length; j++) {
        if (data.channel[i].messages[j].messageId === messageId) {
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

/**
 * <Function creates and sends a message to a specific dm>
 *
 * Arugments:
 * <token> is a <string> and is a users session specific identity
 * <dmId> is a <number> and is a dms specific identity
 * <message> is a <string> and is the message that the user wants to send in the channel
 *
 * Return Value:
 * <400 Error> when <dmId does not refer to a valid DM>
 * <400 Error> when <length of message is less than 1 or over 1000 characters>
 * <400 Error> when <token refers to an invalid token>
 * <403 Error> when <dmId is valid and the authorised user is not a member of the DM>
 * <{ messageId }> when <everything is inputted correctly>
 *
 */
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

  const tempMessage:messageType = {
    messageId: Math.floor(Math.random() * Date.now()),
    uId: uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
    reacts: [],
    isPinned: false
  };

  data.dm[dmIndex].messages.push(tempMessage);

  // Notification Sending to tagged people
  // Extracting tags from message
  const handles = [];
  for (let i = 0; i < message.length; i++) {
    if (message[i] === '@') {
      let handle = '';
      for (let j = i + 1; message[j] !== ' ' && message[j] !== '@'; j++) {
        handle = handle + message[j];
      }
      handles.push(handle);
    }
  }

  // Cutting message for notification
  const sedingMessage = message.slice(0, 20);

  // Sending the notification
  for (const handle of handles) {
    for (const user in data.user) {
      if (data.user[user].handle === handle) {
        data.user[user].notifications.push({
          channelId: -1,
          dmId: dmId,
          notificationMessage: data.user[flag].handle + ' tagged you in ' + data.dm[dmIndex].name + ': ' + sedingMessage,
          type: 1
        });
      }
    }
  }

  setData(data);
  return { messageId: tempMessage.messageId };
}

export { messageSendV1, messageRemoveV1, messageEditV1, messageSenddmV2 };
