import { getData, setData, messageType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

export function messageShareV1(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const data: dataType = getData();

  // Checking token
  const flag = getTokenIndex(token, data);
  if (flag === -1) {
    throw HTTPError(400, 'Invalid Token');
  }

  // getting the uId of the message send
  const uId = data.user[flag].authUserId;

  // creating a user for the token user
  const user = data.user[flag];

  // checking if dm or channel
  let isDm = false;
  let isChannel = false;
  if (channelId === -1) {
    isDm = true;
  }
  if (dmId === -1) {
    isChannel = true;
  }
  if (isChannel === true && isDm === true) {
    throw HTTPError(400, 'Neither dmId or channelId are -1');
  }

  let ogMessage = '';
  let isAMember = false;
  let foundMessage = false;

  // finding the exact message relating to the ogMessageId
  for (const channel of data.channel) {
    for (const imessage of channel.messages) {
      if (ogMessageId === imessage.messageId) {
        ogMessage = imessage.message;
        foundMessage = true;
        // need to make sure the user is apart of this channel
        for (const member of channel.members) {
          if (member.authUserId === uId) {
            isAMember = true;
          }
        }
        if (isAMember === false) {
          throw HTTPError(400, 'ogMessage does not refer to a valid message within a channel/DM that the authorised user has joined');
        }
      }
    }
  }
  for (const dm of data.dm) {
    for (const imessage of dm.messages) {
      if (ogMessageId === imessage.messageId) {
        ogMessage = imessage.message;
        foundMessage = true;
        // need the check the user is apart of this channel
        if (dm.members.includes(uId) === false) {
          throw HTTPError(400, 'ogMessage does not refer to a valid message within a channel/DM that the authorised user has joined');
        }
      }
    }
  }

  // length of message is more that 1000 characters
  if (message.length > 1000) {
    throw HTTPError(400, 'length of message is more thatn 1000 characters');
  }

  // generating the messageId for the new message
  const sharedMessageId = Math.floor(Math.random() * Date.now());

  // generating the timeSent for the new message
  const timeSent = Math.floor(Date.now() / 1000);

  // creating the combined message
  const combinedMessage = ogMessage + '//' + message;

  // creating a new object for the message
  const newMessage: messageType = {
    messageId: sharedMessageId,
    uId: uId,
    message: combinedMessage,
    timeSent: timeSent,
    reacts: [],
    isPinned: false
  };

  let isValidChannelId = false;
  let isValidDmId = false;
  let isMember = false;

  // finding the exact channel for the channel case and adding message
  if (isChannel === true) {
    for (const channel of data.channel) {
      if (channel.cId === channelId) {
        // need to make sure he authorised user is apart of this channel
        for (const member of channel.members) {
          if (member.authUserId === uId) {
            isMember = true;
          }
        }
        if (isMember === false) {
          throw HTTPError(403, 'authorised user is not a member of the specified channelId');
        }
        // couldn't find the ogMessage
        if (foundMessage === false) {
          throw HTTPError(400, 'ogMessage does not refer to a valid message');
        }
        channel.messages.push(newMessage);
        isValidChannelId = true;
      }
    }
  }

  // finding the exact dm for the dm case and adding message
  if (isDm === true) {
    for (const dm of data.dm) {
      if (dm.dmId === dmId) {
        // need to make sure he authorised user is apart of this channel
        if (dm.members.includes(uId) === false) {
          throw HTTPError(403, 'authorised user is not a member of the specified dmId');
        }
        // couldn't find the ogMessage
        if (foundMessage === false) {
          throw HTTPError(400, 'ogMessage does not refer to a valid message');
        }
        dm.messages.push(newMessage);
        isValidDmId = true;
      }
    }
  }
  if (isValidChannelId === false && isValidDmId === false) {
    throw HTTPError(400, 'both channelId and dmId are invalid');
  }
  setData(data);
  return { sharedMessageId };
}

export function messagePinV1(token: string, MessageId: number) {
  const data: dataType = getData();
  return {};
}

export function messageUnpinV1(token: string, MessageId: number) {
  const data: dataType = getData();
  return {};
}

export function messageSendLaterV1(token: string, channelId: number, message: string, timeSent: number) {
  const data: dataType = getData();
  const messageId = 0;
  return { messageId };
}

export function messageSendLaterDmV1(token: string, dmId: number, message: string, timeSent: number) {
  const data: dataType = getData();
  const messageId = 0;
  return { messageId };
}
