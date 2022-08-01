import { getData, messageType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

export function search(token: string, queryStr: string) {
  const data: dataType = getData();

  const flag = getTokenIndex(token, data);
  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const userId = data.user[flag].authUserId;
  if (queryStr.length < 1 || queryStr.length > 1000) {
    throw HTTPError(400, 'Invalid querySt');
  }
  queryStr = queryStr.toLowerCase();
  const returnData: messageType[] = [];

  let isMember = false;
  for (const dm of data.dm) {
    for (const member of dm.members) {
      if (userId === member) {
        isMember = true;
      }
    }

    if (isMember === true) {
      for (const message of dm.messages) {
        const messageStr = message.message.toLowerCase();
        if (messageStr.indexOf(queryStr) !== -1) {
          returnData.push(message);
        }
      }
    }
    isMember = false;
  }

  let isChannelMember = false;
  for (const channel of data.channel) {
    for (const member of channel.members) {
      if (userId === member.authUserId) {
        isChannelMember = true;
      }
    }

    if (isChannelMember === true) {
      for (const message of channel.messages) {
        const messageStr = message.message.toLowerCase();
        if (messageStr.indexOf(queryStr) !== -1) {
          returnData.push(message);
        }
      }
    }
    isChannelMember = false;
  }
  return { messages: returnData };
}
