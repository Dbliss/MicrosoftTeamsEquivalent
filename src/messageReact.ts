import { getData, setData, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

export function messageReact(token: string, messageId: number, reactId: number) {
  const data: dataType = getData();

  // Checking token
  const flag = getTokenIndex(token, data);
  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const uId = data.user[flag].authUserId;

  // Checking if ReactId is valid
  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid ReactId');
  }

  let validMessageId = 0;
  let dmIndex = -1;
  let messageIndex = -1;
  const reactIndex = 0;
  let messageSender = -1;
  for (const dm of data.dm) {
    dmIndex++;
    const dmId = dm.dmId;
    const name = dm.name;
    for (const message of dm.messages) {
      messageIndex++;
      if (message.messageId === messageId) {
        validMessageId = 1;
        messageSender = message.uId;
        if (message.reacts[reactIndex] === undefined) {
          data.dm[dmIndex].messages[messageIndex].reacts.push({
            reactId: reactId,
            uIds: [uId],
            isThisUserReacted: false
          });
          notificaitonSender(flag, messageSender, data, -1, dmId, name);
        } else {
          for (const user of message.reacts[reactIndex].uIds) {
            if (user === uId) {
              throw HTTPError(400, 'Already Reacted');
            }
          }
          data.dm[dmIndex].messages[messageIndex].reacts[reactIndex].uIds.push(uId);
          notificaitonSender(flag, messageSender, data, -1, dmId, name);
        }
      }
    }
    messageIndex = -1;
  }

  let channelIndex = -1;
  messageIndex = -1;
  for (const channel of data.channel) {
    channelIndex++;
    const channelId = channel.cId;
    const name = channel.name;
    for (const messages of channel.messages) {
      messageIndex++;
      if (messages.messageId === messageId) {
        validMessageId = 1;
        messageSender = messages.uId;
        if (messages.reacts[reactIndex] === undefined) {
          data.channel[channelIndex].messages[messageIndex].reacts.push({
            reactId: reactId,
            uIds: [uId],
            isThisUserReacted: false
          });
          notificaitonSender(flag, messageSender, data, channelId, -1, name);
        } else {
          for (const user of messages.reacts[reactIndex].uIds) {
            if (user === uId) {
              throw HTTPError(400, 'Already Reacted');
            }
          }
          data.channel[channelIndex].messages[messageIndex].reacts[reactIndex].uIds.push(uId);
          notificaitonSender(flag, messageSender, data, channelId, -1, name);
        }
      }
    }
    messageIndex = -1;
  }

  if (validMessageId === 0) {
    throw HTTPError(400, 'Invalid MessageId');
  }

  setData(data);
  return {};
}
export function messageUnreact(token: string, messageId: number, reactId: number) {
  const data: dataType = getData();

  // Checking token
  const flag = getTokenIndex(token, data);
  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const uId = data.user[flag].authUserId;

  // Checking if ReactId is valid
  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid ReactId');
  }

  let validMessageId = 0;
  let dmIndex = -1;
  let messageIndex = -1;
  let reactIndex = 0;
  for (const dm of data.dm) {
    dmIndex++;
    for (const message of dm.messages) {
      messageIndex++;
      if (message.messageId === messageId) {
        validMessageId = 1;
        let validReact = 0;
        let userIndex = -1;
        if (message.reacts[reactIndex] !== undefined) {
          for (const user of message.reacts[reactIndex].uIds) {
            userIndex++;
            if (user === uId) {
              validReact = 1;
              data.dm[dmIndex].messages[messageIndex].reacts[reactIndex].uIds.splice(userIndex, 1);
            }
          }
        }
        if (validReact === 0) {
          throw HTTPError(400, 'Not Reacted');
        }
      }
    }
    messageIndex = -1;
  }
  let channelIndex = -1;
  reactIndex = 0;
  messageIndex = -1;
  for (const channel of data.channel) {
    channelIndex++;
    for (const message of channel.messages) {
      messageIndex++;
      if (message.messageId === messageId) {
        validMessageId = 1;
        let validReact = 0;
        let userIndex = -1;
        if (message.reacts[reactIndex] !== undefined) {
          for (const user of message.reacts[reactIndex].uIds) {
            userIndex++;
            if (user === uId) {
              validReact = 1;
              data.channel[channelIndex].messages[messageIndex].reacts[reactIndex].uIds.splice(userIndex, 1);
            }
          }
        }
        if (validReact === 0) {
          throw HTTPError(400, 'Not Reacted');
        }
      }
    }
    messageIndex = -1;
  }

  if (validMessageId === 0) {
    throw HTTPError(400, 'Invalid MessageId');
  }
  setData(data);
  return {};
}

function notificaitonSender(tagger: number, sender: number, data: dataType, channelId: number, dmId: number, name: string) {
  let userIndex = -1;
  const taggerName = data.user[tagger].handle;
  for (const user of data.user) {
    userIndex++;
    if (user.authUserId === sender) {
      data.user[userIndex].notifications.push({
        channelId: channelId,
        dmId: dmId,
        notificationMessage: taggerName + ' reacted to your message in ' + name,
        type: 2,
      });
    }
  }
}
