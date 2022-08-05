import { dataType, getData, setData } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';
import { messageSendV1 } from './message';

const standupStartV1 = (token: string, channelId: number, length: number) => {
  const data:dataType = getData();

  // Checking if token is valid and taking out the userId of the user
  const userIndex = getTokenIndex(token, data);
  if (userIndex === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const uId = data.user[userIndex].authUserId;

  // check to see if channelId is valid
  let isChannelIdValid = false;
  let channelIndex = -1;
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      isChannelIdValid = true;
      channelIndex = i;
    }
  }

  if (isChannelIdValid === false) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // check to see if length is a negative number
  if (length < 0) {
    throw HTTPError(400, 'Length is a negative integer');
  }

  // check to see if standup is active
  if (data.channel[channelIndex].standup.timeStart !== null) {
    throw HTTPError(400, 'Another standup is active');
  }

  // check to see if member is in channel
  let isMemberValid = false;
  for (let k = 0; k < data.channel[channelIndex].members.length; k++) {
    if (data.channel[channelIndex].members[k].authUserId === uId) {
      isMemberValid = true;
    }
  }
  if (isMemberValid === false) {
    throw HTTPError(403, 'Member not in channel');
  }

  // initialise data and start standup
  data.channel[channelIndex].standup.timeStart = Date.now() / 1000;
  data.channel[channelIndex].standup.length = length;
  setData(data);
  setTimeout(finishStandup, length * 1000, token, channelIndex, channelId);

  const timeFinishNoInteger = length - (Date.now() / 1000 - data.channel[channelIndex].standup.timeStart);
  const timeFinish = Math.round(timeFinishNoInteger);
  return { timeFinish: timeFinish };
};

// finish standup
function finishStandup(token: string, channelIndex: number, channelId: number) {
  let data:dataType = getData();
  const messages = data.channel[channelIndex].standup.messages;
  try {
    if (messages.length > 0) {
      messageSendV1(token, channelId, messages);
      data = getData();
      data.channel[channelIndex].standup.messages = '';
      data.channel[channelIndex].standup.timeStart = null;
      data.channel[channelIndex].standup.length = null;
      setData(data);
    }
  } catch (err) {
    console.log(err);
  }
}
const standupActiveV1 = (token: string, channelId: number) => {
  const data:dataType = getData();

  // Checking if token is valid and taking out the userId of the user
  const userIndex = getTokenIndex(token, data);
  if (userIndex === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const uId = data.user[userIndex].authUserId;

  // check to see if channelId is valid
  let isChannelIdValid = false;
  let channelIndex = -1;
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      isChannelIdValid = true;
      channelIndex = i;
    }
  }

  if (isChannelIdValid === false) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // check to see if member is in channel
  let isMemberValid = false;
  for (let k = 0; k < data.channel[channelIndex].members.length; k++) {
    if (data.channel[channelIndex].members[k].authUserId === uId) {
      isMemberValid = true;
    }
  }
  if (isMemberValid === false) {
    throw HTTPError(403, 'Member not in channel');
  }

  // check to see if standup is active and set time finish and is active accordingly
  let isActive = false;
  let timeFinish = -1;
  if (data.channel[channelIndex].standup.timeStart !== null) {
    isActive = true;
    timeFinish = data.channel[channelIndex].standup.length - (Date.now() / 1000 - data.channel[channelIndex].standup.timeStart);
  } else {
    timeFinish = null;
  }
  setData(data);
  return { isActive: isActive, timeFinish: timeFinish };
};

const standupSendV1 = (token: string, channelId: number, message: string) => {
  const data:dataType = getData();

  // Checking if token is valid and taking out the userId of the user
  const userIndex = getTokenIndex(token, data);
  if (userIndex === -1) {
    throw HTTPError(403, 'Invalid Token');
  }
  const uId = data.user[userIndex].authUserId;

  // check to see if channelId is valid
  let isChannelIdValid = false;
  let channelIndex = -1;
  for (let i = 0; i < data.channel.length; i++) {
    if (data.channel[i].cId === channelId) {
      isChannelIdValid = true;
      channelIndex = i;
    }
  }
  if (isChannelIdValid === false) {
    throw HTTPError(400, 'Invalid channelId');
  }

  // check to see if message is longer than 1000 characters
  if (message.length > 1000) {
    throw HTTPError(400, 'message longer than 1000 characters');
  }

  // check to see if active standup is running
  if (data.channel[channelIndex].standup.timeStart === null) {
    throw HTTPError(400, 'active standup not currently running');
  }

  // check to see if member is in channel
  let isMemberValid = false;
  for (let k = 0; k < data.channel[channelIndex].members.length; k++) {
    if (data.channel[channelIndex].members[k].authUserId === uId) {
      isMemberValid = true;
    }
  }
  if (isMemberValid === false) {
    throw HTTPError(403, 'Member not in channel');
  }

  // get handle and format message
  const handle = data.user[userIndex].handle;
  const formattedmsg = handle + ':' + message;

  // send message
  data.channel[channelIndex].standup.messages += formattedmsg + '\n';
  setData(data);
  return {};
};

export { standupStartV1, standupActiveV1, standupSendV1 };
