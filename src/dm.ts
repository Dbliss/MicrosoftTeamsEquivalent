import { getData, setData, dmType, dmmessageType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

// Funtion to create a dm

// Arguments:
// token (string) - Token shows an active session of the user
// uIds (number[]) - array of userIds who need to be added to the dm

// Return Values:
// Returns {dmId: dmId} (integer) on valid token and uIds
// Returns {error: 'error'} on invalid token - Being token does not exist
// Returns {error: 'error'} on invalid uIds - If a uId does not exist or is repeated

function dmCreate (token: string, uIds: number[]) {
  const data:dataType = getData();

  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  const flag = getTokenIndex(token, data);

  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }

  // Checking if uId is valid and if no uId is being repeated
  let validUId = 0;
  let uIdRepeat = 0;
  const dmNames = [];
  for (const uId of uIds) {
    // Loop to check presence of uId in data
    for (const user of data.user) {
      if (uId === user.authUserId) {
        dmNames.push(user.handle);
        validUId++;
      }
    }
    // Loop to check repeating uIds
    for (const repeat of uIds) {
      if (repeat === uId) {
        uIdRepeat++;
      }
    }
  }

  if (validUId < uIds.length || uIdRepeat > uIds.length) {
    throw HTTPError(400, 'Invalid uIds');
  }

  // Creating name bu sorting and joining handles of all users
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
  // Adding single quotes to the name
  name = "'" + name + "'";
  uIds.push(data.user[flag].authUserId);
  const tempDm: dmType = {
    dmId: Math.floor(Math.random() * Date.now()),
    name: name,
    members: uIds,
    owners: [data.user[flag].authUserId],
    messages: [],
  };

  data.dm.push(tempDm);
  setData(data);
  return { dmId: tempDm.dmId };
}

// Funtion to list dms that user is part of

// Arguments:
// token (string) - Token shows an active session of the user

// Return Values:
// Returns [dms] (array of objects having name and dmId) on valid token
// Returns {error: 'error'} on invalid token - Being token does not exist

function dmList (token: string) {
  const data:dataType = getData();
  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  const flag = getTokenIndex(token, data);

  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }

  // Assigning userId
  const authUserId = data.user[flag].authUserId;
  // Pushing details of dm into an array
  type retunDmType = {
    dms: {
      dmId: number,
      name: string
    }[]
  }

  const tempDms:retunDmType = { dms: [] };
  for (const dm of data.dm) {
    for (const member of dm.members) {
      if (member === authUserId) {
        tempDms.dms.push({ dmId: dm.dmId, name: dm.name });
      }
    }
  }
  return tempDms;
}

// Funtion to remove a dm

// Arguments:
// token (string) - Token shows an active session of the user
// dmId (number) - dmId of dm that needs to be removed

// Return Values:
// Returns {}  on valid token and uIds
// Returns {error: 'error'} on invalid token - Being token does not exist
// Returns {error: 'error'} on invalid dmId - dmId not valid
// Returns {error: 'error'} on invalid user - user not an owner of the dm

function dmRemove (token: string, dmId: number) {
  const data:dataType = getData();
  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  const flag = getTokenIndex(token, data);

  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  // Validates dmId and if uer is part of dm
  // Also splices the dm if everything is valid
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
      // Returning error if user is not a member
      if (isMember === 0) {
        throw HTTPError(403, 'Not Member');
      }

      // Checking if user if owner of dm
      if (dm.owners[ownersIndex] === data.user[flag].authUserId) {
        validCreator = 1;
        data.dm.splice(dmIndex, 1);
      }
    }
    dmIndex++;
  }

  if (validDmId === 0) {
    throw HTTPError(400, 'Invalid dmId');
  }

  if (validCreator === 0) {
    throw HTTPError(403, 'Not original creator');
  }

  setData(data);
  return {};
}

// Funtion to show details of particular dm

// Arguments:
// token (string) - Token shows an active session of the user
// dmId (number) - dmId of dm that needs to be detailed

// Return Values:
// Returns {name: , members: }  on valid token and uIds
// Returns {error: 'error'} on invalid token - Being token does not exist
// Returns {error: 'error'} on invalid dmId - dmId not valid

function dmDetails(token: string, dmId: number) {
  const data:dataType = getData();
  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  const flag = getTokenIndex(token, data);

  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  // Validates dmId and if uer is part of dm
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

  if (validDmId === 0) {
    throw HTTPError(400, 'Invalid dmId');
  }
  if (isMember === 0) {
    throw HTTPError(403, 'Not a member');
  }

  // Extraction and pushing necessary data of the member to an array of the members
  const tempMembers = [];
  for (const member of data.dm[dmIndex].members) {
    for (const user of data.user) {
      if (user.authUserId === member) {
        tempMembers.push({
          uId: user.authUserId,
          email: user.email,
          nameFirst: user.nameFirst,
          nameLast: user.nameLast,
          handleStr: user.handle
        });
      }
    }
  }
  const returnObject = { name: data.dm[dmIndex].name, members: tempMembers };
  return returnObject;
}

// Funtion to leave a dm

// Arguments:
// token (string) - Token shows an active session of the user
// dmId (number) - dmId of dm that needs to be removed

// Return Values:
// Returns {}  on valid token and uIds
// Returns {error: 'error'} on invalid token - Being token does not exist
// Returns {error: 'error'} on invalid dmId - dmId not valid
// Returns {error: 'error'} on invalid user - user not a member of the dm

function dmLeave(token: string, dmId: number) {
  const data:dataType = getData();
  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  const flag = getTokenIndex(token, data);

  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
  }

  // Validates dmId and if uer is part of dm
  // Also removes the member if everything is valid
  let validDmId = 0;
  let isMember = 0;
  let dmIndex = 0;
  let memberIndex = 0;
  for (const dm of data.dm) {
    if (dm.dmId === dmId) {
      validDmId = 1;
      for (const member of dm.members) {
        if (member === data.user[flag].authUserId) {
          isMember = 1;
          data.dm[dmIndex].members.splice(memberIndex, 1);
        }
        memberIndex++;
      }
    }
    dmIndex++;
  }

  if (validDmId === 0) {
    throw HTTPError(400, 'Invalid dmId');
  }
  if (isMember === 0) {
    throw HTTPError(403, 'Not a member');
  }

  setData(data);
  return {};
}

// Funtion to view messages of the dm

// Arguments:
// token (string) - Token shows an active session of the user
// dmId (number) - dmId of dm that needs to be removed
// Start (number) - Index of from where the messages need to be seen

// Return Values:
// Returns {messages: , start: , end: }
//  (messages is an array of strings od messages)
//  (start is the staring point of messages sent)
//  (end is ending point of messages send - will be start +50 but if there are not 50 messages to show, end = -1 )
// on valid token and uIds
// Returns {error: 'error'} on invalid token - Being token does not exist
// Returns {error: 'error'} on invalid dmId - dmId not valid
// Returns {error: 'error'} on invalid user - user not an member of the dm
// Returns {error: 'error'} on invalid start - start is larger than messages existing

function dmMessages (token: string, dmId: number, start: number) {
  const data:dataType = getData();
  // Checking if token is valid and taking out the userId of the user
  // Also gets the index of user and stores it on flag
  const flag = getTokenIndex(token, data);

  if (flag === -1) {
    throw HTTPError(403, 'Invalid Token');
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

  // Returns error if start, dmId or user is invaid
  if (validDmId === 0) {
    throw HTTPError(400, 'Invalid dmId');
  }
  if (isMember === 0) {
    throw HTTPError(403, 'Not a member');
  }
  if (data.dm[dmIndex].messages.length < start) {
    throw HTTPError(400, 'Invalid Start');
  }

  // Reversing data so that the latest messages are returned
  data.dm[dmIndex].messages.reverse();
  const returnMessages: dmmessageType[] = [];
  let end = 0;
  let returnEnd = start + 50;

  // Assigning end of the loop by start+50 or the end of messages by whichever comes first
  if ((start + 50) > data.dm[dmIndex].messages.length) {
    end = data.dm[dmIndex].messages.length;
    returnEnd = -1;
  } else {
    end = start + 50;
  }

  // Pushing the messages to a array
  for (let i = start; i < end; i++) {
    returnMessages.push(data.dm[dmIndex].messages[i]);
  }
  return { messages: returnMessages, start: start, end: returnEnd };
}

export { dmCreate, dmList, dmRemove, dmDetails, dmLeave, dmMessages };
