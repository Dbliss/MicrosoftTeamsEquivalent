import { getData, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

const maxNotifications = 20;

export function getNotifications(token: string) {
  const data:dataType = getData();

  const flag = getTokenIndex(token, data);
  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  type returnArrayType = {
    channelId: number,
    dmId: number,
    notificationMessage: string,
  }
  const returnArray: returnArrayType[] = [];
  for (let i = 0; i < maxNotifications; i++) {
    if (data.user[flag].notifications[i] !== undefined) {
      let valid = 0;

      if (data.user[flag].notifications[i].type !== 3) {
        if (data.user[flag].notifications[i].channelId !== -1) {
          valid = channelMemberChecker(data, data.user[flag].authUserId);
        } else {
          valid = dmMemberChecker(data, data.user[flag].authUserId);
        }
      } else {
        valid = 1;
      }
      if (valid === 1) {
        returnArray.push({
          channelId: data.user[flag].notifications[i].channelId,
          dmId: data.user[flag].notifications[i].dmId,
          notificationMessage: data.user[flag].notifications[i].notificationMessage
        });
      }
    }
  }

  return { notifications: returnArray };
}

function channelMemberChecker(data: dataType, uId: number) {
  for (const channel of data.channel) {
    for (const member of channel.members) {
      if (member.authUserId === uId) {
        return 1;
      }
    }
  }
  return 0;
}

function dmMemberChecker(data: dataType, uId: number) {
  for (const dm of data.dm) {
    for (const member of dm.members) {
      if (member === uId) {
        return 1;
      }
    }
  }
  return 0;
}
