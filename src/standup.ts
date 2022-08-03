import { dataType, getData } from "./dataStore";
import { getTokenIndex } from "./users";
import HTTPError from 'http-errors';



const standupStartV1 = (token: string, channelId: number, length: number) => {
    const data:dataType = getData();

    // Checking if token is valid and taking out the userId of the user
    const userIndex = getTokenIndex(token, data);
    if (userIndex === -1) {
        throw HTTPError(403, 'Invalid Token');
    }

    // check to see if channelId is valid 
    let isChannelIdValid = false;
    let channelIndex = -1;
    for (let i = 0; data.channel.length; i++) {
        if (channelId === data.channel[i].cId) {
            channelIndex = i;
            isChannelIdValid = true;
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

    // channelId valid but member not in channel 
    let isMemberValid = false;
    const memberUserId = data.user[userIndex].authUserId
    for (let i = 0; data.channel[channelIndex].members.length; i++) {
        if (memberUserId === data.channel[channelIndex].members[i].authUserId) {
            isMemberValid = true;
        }
    }
    if (isMemberValid === false) {
        throw HTTPError(403, 'member not in channel')
    }

    // start standup
    setTimeout(finishStandup, length * 1000); 
    data.channel[channelIndex].standup.timeStart = Date.now()/1000;
    data.channel[channelIndex].standup.length = length;

    // finish standup
    function finishStandup() {

    }
    

    let timeFinish = length - (Date.now()/1000 - data.channel[channelIndex].standup.timeStart);
    return { timeFinish: timeFinish };
}

const standupActiveV1 = (token: string, channelId: number) => {
    const data:dataType = getData();

    // Checking if token is valid and taking out the userId of the user
    const userIndex = getTokenIndex(token, data);
    if (userIndex === -1) {
        throw HTTPError(403, 'Invalid Token');
    }

    // check to see if channelId is valid 
    let isChannelIdValid = false;
    let channelIndex = -1;
    for (let i = 0; data.channel.length; i++) {
        if (channelId === data.channel[i].cId) {
            channelIndex = i;
            isChannelIdValid = true;
        }
    }
    if (isChannelIdValid === false) {
        throw HTTPError(400, 'Invalid channelId');
    }

    // channelId valid but member not in channel 
    let isMemberValid = false;
    const memberUserId = data.user[userIndex].authUserId
    for (let i = 0; data.channel[channelIndex].members.length; i++) {
        if (memberUserId === data.channel[channelIndex].members[i].authUserId) {
            isMemberValid = true;
        }
    }
    if (isMemberValid === false) {
        throw HTTPError(403, 'member not in channel')
    }

    // check to see if standup is active
    let isActive = false;
    if (data.channel[channelIndex].standup.timeStart !== null) {
        isActive = true;
    }
    
    return { isActive, timeFinish:  };
}

const standupSendV1 = (token: string, channelId: number, message: string) => {
    return {};
}

export { standupStartV1, standupActiveV1, standupSendV1 };