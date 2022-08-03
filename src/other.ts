import {
  setData, dataType
} from './dataStore';

import crypto from 'crypto';
import { rawListeners } from 'process';
import { getTokenIndex } from './users';
const SECRET = 'SecretSAUCE';

// <Resets the internal data of the application to its initial state>

// Arguments:
// Function takes in no arguments, {}

// Return Value:
// Function returns an empty object {}

function clearV1() {
  // making a replica of the data structure with zero information
  const emptyData: dataType = {
    user: [],
    channel: [],
    dm: [],
    stats: [],
  };
  // setting the cleared data as the original
  setData(emptyData);
  return {};
}

function getHashOf(plaintext: string) {
  const hashed = crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
  console.log(`The hashed token value is: ${hashed}`);
  return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
}

function involvementRateCalc(token: string, data: dataType, numChannelsJoined: number, numDmsJoined: number, numMessagesSent: number ) {
  const index = getTokenIndex(token, data);
  const uId = data.user[index].authUserId;
  let dmNum = 0;
  for (const dms of data.dm) {
    for (const uIds of dms.members) {
      if (uIds === uId) {
        dmNum++;
      }
    }
  }
  
  // finding number of messages in dm
  let msgNum = 0;
  for (const dms of data.dm) {
    for (const messages of dms.messages) {
      if (messages.uId === uId) {
        msgNum++;
      }
    }
  }
  
  // finding number of messages in channel
  for (const channels of data.channel) {
    for (const messages of channels.messages) {
      if (messages.uId === uId) {
        msgNum++;
      }
    }
  }
  
  const denominator = data.user[index].channels.length + dmNum + msgNum;

  const sum = numChannelsJoined + numDmsJoined + numMessagesSent;

  if (denominator === 0) {
    return denominator;
  }
  else if (sum/denominator > 1) {
    return 1;
  } 
  return (sum/denominator);
}


function utilizationRateCalc (data: dataType) {
  let joined = 0;
  let numUsers = data.stats.length;
  for (const user of data.stats) {
   
      if (user.channelsJoined.length > 1 || user.dmsJoined.length > 1) {
        joined++;
      } 
    
  }
  return joined/numUsers;
}

function getIndexOfStatsUid (data: dataType, token: string) {
  const tokenIndex = getTokenIndex(token, data);
  const uId = data.user[tokenIndex].authUserId;
  const userIndex = data.stats.findIndex((object: any) => {
    return object.uId === uId;
  });
  return userIndex;
}


export { clearV1, getHashOf, involvementRateCalc, utilizationRateCalc, getIndexOfStatsUid };
