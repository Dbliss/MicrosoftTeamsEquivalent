import {getData, setData}  from './dataStore.js';

// Returns a string concatination of the input arguments 'authUserId' and 'channelId'
function channelDetailsV1 (authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// Returns a string concatination of the input arguments 'authUserId' and 'channelId'
function channelJoinV1 (authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// Returns a string concatination of the input arguments 'authUserId', 'channelId' and 'uId'
function channelInviteV1 (authUserId, channelId, uId) {
    //getting the dataset
    let dataSet = getData();

    let validChannel = false;
    let validUid = false;

    let currentChannel = {};

    //checking the channelId is valid
    for (let channel of dataSet.channel){
        if (channel.cId === channelId){
            validChannel = true;
            currentChannel =  channel;
        }
    }
    
    //checking the uId is valid
    for (let user of dataSet.user){
        if (user.authUserId === uId){
            validUid = true;
        }
    }

    //checking that the uId isnt already in the channel
    if (currentChannel.members.includes(uId) === true){
         return {error: 'error'};
    }

    //checking the authUserId is apart of the channel 
    if (currentChannel.members.includes(authUserId) === false){
        return {error: 'error'};
   }

   //checking valid inputted channelId and uId 
     if (validChannel  === false || validUid === false){
        return {error: 'error'};
    }

    //putting the user into the channel
    currentChannel.members.push(uId);
    let newData = {
        user: dataSet.user,
        channel: currentChannel,
    };
    setData(newData);

    
    return {};
}

// Returns a string concatination of the input arguments 'authUserId', 'channelId' and 'start'
function channelMessagesV1 (authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}

export { channelInviteV1 };