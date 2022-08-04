import {
  setData, dataType
} from './dataStore';

import crypto from 'crypto';
import { rawListeners } from 'process';
import { getTokenIndex } from './users';
import { statSync } from 'fs';
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
    workSpaceStats: {
      channelsExist: [] ,
      dmsExist: [],
      messagesExist: [],
      utilizationRate: -1
    }
  };
  // setting the cleared data as the original
  setData(emptyData);
  return {};
}

function getIndexOfStatsUid (data: dataType, token: string) {
  const tokenIndex = getTokenIndex(token, data);
  const uId = data.user[tokenIndex].authUserId;
  const userIndex = data.stats.findIndex((object: any) => {
    return object.uId === uId;
  });
  return userIndex;
}


function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
}

function involvementRateCalc(token: string, data: dataType ) {
  const statsIndex = getIndexOfStatsUid(data, token);
  const numChannelsJoined = data.stats[statsIndex].channelsJoined[data.stats[statsIndex].channelsJoined.length - 1].numChannelsJoined;
  const numDmsJoined = data.stats[statsIndex].dmsJoined[data.stats[statsIndex].dmsJoined.length - 1].numDmsJoined;
  const numMessagesSent = data.stats[statsIndex].messagesSent[data.stats[statsIndex].messagesSent.length - 1].numMessagesSent;
  
  const numDms = data.dm.length;
  
  let numMessages = 0;
  for (const channel of data.channel) {
    numMessages += channel.messages.length
  }
  for (const dm of data.dm) {
    numMessages += dm.messages.length
  }
  const numChannels = data.channel.length
  
  
  const denominator = numChannels + numDms + numMessages;

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



export { clearV1, getHashOf, involvementRateCalc, utilizationRateCalc, getIndexOfStatsUid };
