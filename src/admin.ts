import { dataType, getData, setData } from './dataStore';

import HTTPError from 'http-errors';
import { getTokenIndex } from './users';

export function adminUserRemove (token: string, uId: number) {
  const data:dataType = getData();
  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid token');
  }
  const userIndex = data.stats.findIndex((object: any) => {
    return object.uId === uId;
  });
  if (userIndex === -1) {
    throw HTTPError(400, 'Invalid uId');
  }

  if (data.user[tokenIndex].permissionId !== 1) {
    throw HTTPError(403, 'authorised user is not a globalOwner');
  }

  let isOnlyGLobal = true;
  if (data.user[userIndex].permissionId === 1) {
    for (const index in data.user) {
      if (data.user[index].permissionId === 1 && (parseInt(index) !== userIndex)) {
        isOnlyGLobal = false;
      }
    }
    if (isOnlyGLobal === true) {
      throw HTTPError(400, 'uId is a user who is the only global owner');
    }
  }

  // Removing from channels
  const userChannels = data.user[userIndex].channels;
  for (const uChannel of userChannels) {
    for (const channel of data.channel) {
      if (uChannel.cId === channel.cId) {
        const membersIndex = channel.members.findIndex(object => {
          return object.authUserId === uId;
        });
        channel.members.splice(membersIndex, 1);
        const ownersIndex = channel.owners.findIndex(object => {
          return object.authUserId === uId;
        });
        if (ownersIndex !== -1) {
          channel.members.splice(ownersIndex, 1);
        }
        for (const messages of channel.messages) {
          if (messages.uId === uId) {
            messages.message = 'Removed user';
          }
        }
      }
    }
  }

  // Remove from the user channels
  data.user[userIndex].channels = [];

  // Removing the guy from dms members if he is a member
  for (const dm of data.dm) {
    for (const userInd of dm.members) {
      if (dm.members[userInd] === uId) {
        dm.members.splice(userInd, 1);
      }
    }
  }

  // Removing the guy from dms owners if he is an owner
  for (const dm of data.dm) {
    for (const userInd of dm.owners) {
      if (dm.owners[userInd] === uId) {
        dm.owners.splice(userInd, 1);
      }
    }
  }

  // Replacing the messages for the removed guy
  for (const dm of data.dm) {
    for (const messages of dm.messages) {
      if (messages.uId === uId) {
        messages.message = 'Removed user';
      }
    }
  }

  // SPLICING THE data.Stats
  const userStatsIndex = data.stats.findIndex(object => {
    return object.uId === uId;
  });
  data.stats.splice(userStatsIndex, 1);

  // Changing the user names and the email
  data.user[userIndex].nameFirst = 'Removed';
  data.user[userIndex].nameLast = 'user';
  data.user[userIndex].email = 'REMOVED';
  data.user[userIndex].handle = 'REMOVED';

  setData(data);
  return {};
}

export function adminPermissionChange (token: string, uId: number, permissionId: number) {
  const data: dataType = getData();

  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid token');
  }

  const userIndex = data.stats.findIndex((object: any) => {
    return object.uId === uId;
  });

  if (userIndex === -1) {
    throw HTTPError(400, 'Invalid uId');
  }

  if (data.user[tokenIndex].permissionId !== 1) {
    throw HTTPError(403, 'authorised user is not a globalOwner');
  }

  if (permissionId !== 1 && permissionId !== 2) {
    throw HTTPError(400, 'Invalid permisssion Id');
  }

  let isOnlyGLobal = true;
  if (data.user[userIndex].permissionId === 1) {
    for (const index in data.user) {
      if (data.user[index].permissionId === 1 && (parseInt(index) !== userIndex)) {
        isOnlyGLobal = false;
      }
    }
    if (isOnlyGLobal === true && permissionId === 2) {
      throw HTTPError(400, 'only globalOwner is being demoted');
    }
  }

  if (data.user[userIndex].permissionId === permissionId) {
    throw HTTPError(400, 'user already has permission');
  }

  data.user[userIndex].permissionId = permissionId;

  setData(data);
  return {};
}
