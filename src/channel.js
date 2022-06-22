


import { authLoginV1 } from "./auth";
import { getData } from "./dataStore";

// Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.
// Parameters:{ authUserId, channelId }
// Return type if no error:{ name, isPublic, ownerMembers, allMembers }
export function channelDetailsV1 (authUserId, channelId) {
    let data = getData();
    
    let error = {error: 'error'};

    // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
    // and stores it within a variable. If not found -1 is stored
    const user_index = data.user.findIndex(object => {
        return object.authUserId === authUserId;
    }); //code adapted from the website shorturl.at/eoJKY 
    
    const channel_index = data.channel.findIndex(object => {
        return object.cId === channelId;
    });

    // if neither the authUserId nor the channelId is valid then the function
    // returns an error object
    if ((user_index === -1) || (channel_index === -1)) {
        return error;
    }

    // returns the index of the channelId in the channels array of the valid user
    // if the channel is not within the user's channels array then -1 is returned
    const cId_index = data.user[user_index].channels.indexOf(channelId);
    // when the user is not a part of the channel error onject is returned
    if (cId_index === -1) {
        return error;
    }

    
    // using the index of the specified channel in the channel key we access the information
    // and store it within a new object with the relevant information to return
    let return_object = {};
    return_object.name = data.channel[channel_index].name;
    return_object.isPublic = data.channel[channel_index].isPublic;
    return_object.ownerMembers = data.channel[channel_index].ownerMembers;
    return_object.allMembers = data.channel[channel_index].allMembers;

    return return_object;
   
    
    
    // for(const elem of data.user) {
    //     if (elem.authUserId === authUserId) {
    //         val_user = 1;
            
    //     }
    // }

    // for(const elem of data.channel) {
    //     if (elem.cId === channelId) {
    //         val_channel = 1;
    //     }
    // }
}

// Given a channelId of a channel that the authorised user can join, adds them to that channel.
// Parameters:{ authUserId, channelId }
// Return type if no error:{}
export function channelJoinV1 (authUserId, channelId) {

    let data = getData();
    let return_object = {};
    let error = {error: 'error'};
    // The code finds the index of the object which contains the apropriate channelId, in the user key array,
    // and stores it within a variable. If not found -1 is stored
    const channel_index = data.channel.findIndex(object => {
        return object.cId === channelId;
    });

    // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
    // and stores it within a variable. If not found -1 is stored
    const user_index = data.user.findIndex(object => {
        return object.authUserId === authUserId;
    }); //code adapted from the website shorturl.at/eoJKY

    // if neither the authUserId nor the channelId is valid then the function
    // returns an error object
    if ((user_index === -1) || (channel_index === -1)) {
        return error;
    }

    // checking if the channel is public or not if not true then error is returned
    let is_public = data.channel[channel_index].isPublic;
    if(is_public === false) {
        return error;
    }


    // User is able to join the channel and so members is updated within the channel's
    // member array and channels list is updated within the user's channels array
    data.user[user_index].channels.push(channelId);
    data.channel[channel_index].channels.push(authUserId);

    return return_object;
}


// Returns a string concatination of the input arguments 'authUserId', 'channelId' and 'uId'
function channelInviteV1 (authUserId, channelId, uId) {
    return 'authUserId' + 'channelId' + 'uId';
}

// Returns a string concatination of the input arguments 'authUserId', 'channelId' and 'start'
function channelMessagesV1 (authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}
