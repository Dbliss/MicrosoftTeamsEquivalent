
import { getData, setData } from "./dataStore";

// Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.

// Arguments:
    // <authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
    // <channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return Value:
    // Returns <{name, isPublic, ownerMembers, allMembers}> on <valid input of authUserId and channelId>
    // Returns <{error: error}> on <channelId does not refer to a valid channel, and when channelId is 
    //                              valid and the authorised user is not a member of the channel>

function channelDetailsV1 (authUserId, channelId) {
    let data = getData();
    
    let error = {error: 'error'};

    // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
    // and stores it within a variable. If not found -1 is stored
    const user_index = data.user.findIndex(object => {
        return object.authUserId === authUserId;
    }); 
    //code adapted from the website shorturl.at/eoJKY 
    
    // The code finds the index of the object which contains the apropriate channelId, in the channel key array,
    // and stores it within a variable. If not found -1 is stored
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
    
    let tempMembers = [];

    let channel_owners = data.channel[channel_index].owners;

    // Receives all appropriate information from the owners array of user objects and stores them in a
    // object which is pushed to the end of a temporary array tempMembers
    for(let i = 0; i <  data.channel[channel_index].owners.length; i++) {
         tempMembers.push( {
             email: channel_owners[i].email,
             handleStr: channel_owners[i].handle,
             nameFirst: channel_owners[i].nameFirst,
             nameLast: channel_owners[i].nameLast,
             uId: channel_owners[i].authUserId,
        } )
    }

    // setting the array of ownerMembers in the return object to the 
    // tempMembers array
    return_object.ownerMembers = tempMembers;

    // tempMembers is reset to empty
    tempMembers = [];

    let channel_members = data.channel[channel_index].members;

    // Receives all appropriate information from the members array of user objects and stores them in a
    // object which is pushed to the end of a temporary array tempMembers
    for(let j = 0; j <  data.channel[channel_index].members.length; j++) {
        tempMembers.push( {
            email: channel_members[j].email,
            handleStr: channel_members[j].handle,
            nameFirst: channel_members[j].nameFirst,
            nameLast: channel_members[j].nameLast,
            uId: channel_members[j].authUserId,
       } )
   }

   // setting the array of allMembers in the return object to the 
   // tempMembers array
   return_object.allMembers = tempMembers;

    
    return return_object;
 }

// Given a channelId of a channel that the authorised user can join, adds them to that channel.

// Arguments:
    // <authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
    // <channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return Value:
    // Returns <{}> on <valid input of authUserId and channelId>
    // Returns <{error: error}> on <channelId does not refer to a valid channel, 
    //                              the authorised user is already a member of the channel>
function channelJoinV1 (authUserId, channelId) {

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


    // Loops through the array members in the specified channel and checks
    // whether the authorised user is already a member of the channel,
    // if they are then error onject is returned
    for(let i = 0; i < data.channel[channel_index].members.length; i++) {
        if ( data.channel[channel_index].members[i].authUserId === authUserId) {
            return error;
        }
    }
    
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

    let push_object = data.user[user_index];
    

    // User is able to join the channel and so members is updated within the channel's
    // member array and channels array of channelIds is updated within the user's channels array
    data.user[user_index].channels.push(channelId);
    data.channel[channel_index].members.push(push_object);

    // updating the data in the data storage file
    setData(data);

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

export { channelDetailsV1, channelJoinV1 };


