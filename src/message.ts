import { getData, setData, channelType, messageType } from './dataStore';
import { getTokenIndex } from './users';

function messageSendV1(token: string, channelId: number, message: string) {
  const data = getData();
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

  // checking the token is valid
  if (getTokenIndex(token, data) === -1) {
    return { error: 'error' };
  }

  // chekcing the length of the message is within parameters
  if (message.length > 1000 || message.length < 1) {
    return { error: 'error' };
  }

  // checking the user is a member of the channel
  let flag = 0;
  let uId = 0;
  for (const member of currentChannel.members) {
    for (const tokenn of member.token) {
      if (tokenn === token) {
        flag = 1;
        uId = member.authUserId;
      }
    }
  }
  if (flag === 0) {
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
  const data = getData();

  // checking the token is valid
  if (getTokenIndex(token, data) === -1) {
    return { error: 'error' };
  }

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

  // checking the messageId refers to a real message
  let validMessageId = false;
  for (let i = 0; i < data.channel.length; i++) {
    for (const message of data.channel[i].messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
        uId = message.uId;
        timeSent = message.timeSent;
        break;
      }
    }
  }

  if (validMessageId === false) {
    return { error: 'error' };
  }

  // checking the messageId refers to a real message
  for (const channel of data.channel) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
        uId = message.uId;
        timeSent = message.timeSent;
        break;
      }
    }
  }
  const newMessage: messageType = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: timeSent,
  };

  let key1 = -1;
  for (let i = 0; i < data.channel.length; i++) {
    for (let j = 0; i < data.channel[i].messages.length; j++) {
      if (data.channel[i].messages[j].messageId === messageId) {
        key1 = i;
        newMessage.uId = data.channel[i].messages[j].uId;
        newMessage.timeSent = data.channel[i].messages[j].timeSent;
        validMessageId = true;
        deleteCondition === true ? data.channel[i].messages.splice(j, 1) : data.channel[i].messages.splice(j, 1, newMessage);
        break;
      }
    }
  }

  // checking the user is a member of the channel
  let flag = 0;
  for (const member of data.channel[key1].members) {
    for (const tokenn of member.token) {
      if (tokenn === token) {
        flag = 1;
      }
    }
  }
  if (flag === 0) {
    return { error: 'error' };
  }

  setData(data);
  return {};
}

function messageRemoveV1(token: string, messageId: number) {
  const data = getData();

  // checking the token is valid
  if (getTokenIndex(token, data) === -1) {
    return { error: 'error' };
  }

  // checking the messageId refers to a real message
  let validMessageId = false;
  for (let i = 0; i < data.channel.length; i++) {
    for (const message of data.channel[i].messages) {
      if (message.messageId === messageId) {
        validMessageId = true;
      }
    }
  }

  if (validMessageId === false) {
    return { error: 'error' };
  }

  let key1 = -1;
  for (let i = 0; i < data.channel.length; i++) {
    for (let j = 0; i < data.channel[i].messages.length; j++) {
      if (data.channel[i].messages[j].messageId === messageId) {
        key1 = i;
        data.channel[i].messages.splice(j, 1);
        break;
      }
    }
  }

  // checking the user is a member of the channel
  let flag = 0;
  for (const member of data.channel[key1].members) {
    for (const tokenn of member.token) {
      if (tokenn === token) {
        flag = 1;
      }
    }
  }
  if (flag === 0) {
    return { error: 'error' };
  }
  setData(data);
  return {};
}

function messageSenddmV1 (token: string, dmId: number, message: string) {
  const data = getData();

  // checking the token is valid
  if (getTokenIndex(token, data) === -1) {
    return { error: 'error' };
  }

  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  let validToken = 0;
  let flag = 0;
  let uId = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
        uId = data.user[i].uId;
      }
    }
  }

  // returns ettor on invalid token and message length
  if (validToken === 0 || message.length < 1 || message.length > 1000) {
    return { error: 'error' };
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
  if (validDmId === 0 || isMember === 0) {
    return { error: 'error' };
  }

  const tempMessage = {
    messageId: Math.floor(Math.random() * Date.now()),
    uId: uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };

  data.dm[dmIndex].messages.push(tempMessage);

  setData(data);
  return { messageId: tempMessage.messageId };
}

export { messageSendV1, messageRemoveV1, messageEditV1, messageSenddmV1 };
