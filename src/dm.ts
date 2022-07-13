import { getData, setData, dmType } from './dataStore';

function dmCreate (token: string, uIds: number[]) {
  const data = getData();

  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  if (validToken === 0) {
    return { error: 'error' };
  }

  let validUId = 0;
  let uIdRepeat = 0;
  const dmNames = [];
  for (const uId of uIds) {
    for (const user of data.user) {
      if (uId === user.authUserId) {
        dmNames.push(user.handle);
        validUId++;
      }
    }
    for (const repeat of uIds) {
      if (repeat === uId) {
        uIdRepeat++;
      }
    }
  }

  if (validUId < uIds.length || uIdRepeat > uIds.length) {
    return { error: 'error' };
  }

  let name = '';
  let first = 0;
  dmNames.push(data.user[flag].handle);
  dmNames.sort();

  for (const handle of dmNames) {
    if (first === 0) {
      name = name + handle;
    } else {
      name = name + ', ' + handle;
    }
    first++;
  }
  name = "'" + name + "'";

  uIds.push(data.user[flag].authUserId);
  const tempDm: dmType = {
    dmId: Math.floor(Math.random() * Date.now()),
    name: name,
    members: uIds,
    owners: [data.user[flag].authUserId],
  };

  data.dm.push(tempDm);
  setData(data);
  return { dmId: tempDm.dmId };
}

function dmList (token: string) {
  const data = getData();

  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  if (validToken === 0) {
    return { error: 'error' };
  }

  const authUserId = data.user[flag].authUserId;
  const tempDms = [];
  for (const dm of data.dm) {
    for (const member of dm.members) {
      if (member === authUserId) {
        tempDms.push({ dmId: dm.dmId, name: dm.name });
      }
    }
  }
  return tempDms;
}

function dmRemove (token: string, dmId: number) {
  const data = getData();

  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  if (validToken === 0) {
    return { error: 'error' };
  }

  const ownersIndex = 0;
  let dmIndex = 0;
  let validDmId = 0;
  let validCreator = 0;
  let isMember = 0;

  for (const dm of data.dm) {
    if (dm.dmId === dmId) {
      validDmId = 1;
      for (const member of dm.members) {
        if (member === data.user[flag].authUserId) {
          isMember = 1;
        }
      }
      if (isMember === 0) {
        return { error: 'error' };
      }

      if (dm.owners[ownersIndex] === data.user[flag].authUserId) {
        validCreator = 1;
        data.dm.splice(dmIndex, 1);
      }
    }
    dmIndex++;
  }

  if (validDmId === 0 || validCreator === 0) {
    return { error: 'error' };
  }

  setData(data);
  return {};
}

function dmDetails(token: string, dmId: number) {
  const data = getData();

  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  if (validToken === 0) {
    return { error: 'error' };
  }

  let validDmId = 0;
  let isMember = 0;
  let looper = 0;
  let dmIndex = 0;

  for (const dm of data.dm) {
    if (dm.dmId === dmId) {
      dmIndex = looper;
      validDmId = 1;
      for (const member of dm.members) {
        if (member === data.user[flag].authUserId) {
          isMember = 1;
        }
      }
    }
    looper++;
  }

  if (validDmId === 0 || isMember === 0) {
    return { error: 'error' };
  }

  const tempMembers = [];
  for (const member of data.dm[dmIndex].members) {
    for (const user of data.user) {
      if (user.authUserId === member) {
        tempMembers.push({
          uId: user.authUserId,
          email: user.email,
          nameFirst: user.nameFirst,
          nameLast: user.nameLast,
          handleStr: user.handle,
        });
      }
    }
  }

  return ({ name: data.dm[dmIndex].name, members: tempMembers });
}

function dmLeave(token: string, dmId: number) {
  const data = getData();

  let validToken = 0;
  let flag = 0;
  for (let i = 0; i < data.user.length; i++) {
    for (const tokens of data.user[i].token) {
      if (tokens === token) {
        validToken = 1;
        flag = i;
      }
    }
  }

  if (validToken === 0) {
    return { error: 'error' };
  }

  let validDmId = 0;
  const isMember = 0;
  let dmIndex = 0;
  let memberIndex = 0;
  for (const dm of data.dm) {
    if (dm.dmId === dmId) {
      validDmId = 1;
      for (const member of dm.members) {
        if (member === data.user[flag].authUserId) {
          data.dm[dmIndex].members.splice(memberIndex, 1);
        }
        memberIndex++;
      }
    }
    dmIndex++;
  }

  if (validDmId === 0 || isMember === 0) {
    return { error: 'error' };
  }
  setData(data);
  return {};
}

export { dmCreate, dmList, dmRemove, dmDetails, dmLeave };
