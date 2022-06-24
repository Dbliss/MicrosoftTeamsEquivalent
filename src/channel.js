


import { authLoginV1 } from "./auth";
import { getData, setData } from "./dataStore";

// Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.
// Arguments:
// <authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
// <channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return type if no error:{ name, isPublic, ownerMembers, allMembers }
function channelDetailsV1 (authUserId, channelId) {
    let data = getData();
    
    let error = {error: 'error'};

    // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
    // and stores it within a variable. If not found -1 is stored
    const user_index = data.user.findIndex(object => {
        return object.authUserId === authUserId;
    }); 
    //code adapted from the website shorturl.at/eoJKY 
    
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


    for(let i = 0; i <  data.channel[channel_index].owners.length; i++) {
         tempMembers.push( {
             email: channel_owners[i].email,
             handleStr: channel_owners[i].handle,
             nameFirst: channel_owners[i].nameFirst,
             nameLast: channel_owners[i].nameLast,
             uId: channel_owners[i].authUserId,
        } )
    }
    return_object.ownerMembers = tempMembers;

    tempMembers = [];

    let channel_members = data.channel[channel_index].members;

    for(let j = 0; j <  data.channel[channel_index].members.length; j++) {
        tempMembers.push( {
            email: channel_members[j].email,
            handleStr: channel_members[j].handle,
            nameFirst: channel_members[j].nameFirst,
            nameLast: channel_members[j].nameLast,
            uId: channel_members[j].authUserId,
       } )
   }

   return_object.allMembers = tempMembers;

    
    return return_object;
 }

// Given a channelId of a channel that the authorised user can join, adds them to that channel.
// Parameters:{ authUserId, channelId }
// Return type if no error:{}
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
    // member array and channels list is updated within the user's channels array
    data.user[user_index].channels.push(channelId);
    data.channel[channel_index].members.push(push_object);

    

    // updating the data in the data storage file
    setData(data);
    
    

    return return_object;
}


// Returns a string concatination of the input arguments 'authUserId', 'channelId' and 'uId'
function channelInviteV1(authUserId, channelId, uId) {
    //getting the dataset
    let data = getData();

    let validChannel = false;
    let validUid = false;

    let currentChannel = {};
    let currentUser = {};

    // if no channels have been created return an error
    if (JSON.stringify(data.channel) === JSON.stringify([])){
        return {error: 'error'};
    }

    //checking the channelId is valid and setting currentChannel to the valid channel
    for (let channel of data.channel){
        if (channel.cId === channelId){
            validChannel = true;
            currentChannel =  channel;
        }
    }

    //checking the uId is valid 
    for (let user of data.user){
        if (user === uId){
            validUid = true;
            currentUser = user;
        }
    }
 
    
    //checking valid inputted channelId and uId 
    if (validChannel  === false || validUid === false){
        return {error: 'error'};
    }

    //checking that the uId isnt already in the channel
    if (currentChannel.members.includes(uId) === true){
         return {error: 'error'};
    }

    //checking the authUserId is apart of the channel 
    if (currentChannel.members.includes(authUserId) === false){
        return {error: 'error'};
   }

    //need to find which user uId is 
    for (let i = 0; i < data.user.length; i++){
        if (data.user[i].authUserId === uId){
            data.user[i].channels.push(channelId);
            let j = i;
        }
    }


    //need to find which channel channelId is 
    for (let i = 0; i < data.channel.length; i++){
        if (data.channel[i].cId === channelId){
            data.channel[k].members.push(data.user[j]);
        }
    }


    

    setData(data);

    return { };
}


// Returns a string concatination of the input arguments 'authUserId', 'channelId' and 'start'
function channelMessagesV1 (authUserId, channelId, start) {
    //getting the dataset
    let data = getData();

    let currentChannel = {};
    let messages = [];

     // if no channels have been created return an error
    if (data.channel.length === 0){
        return {error: 'error'};
    }
    
    //checking the channelId is valid and setting currentChannel to the valid channel
    let validChannel = false;
    for (let channel of data.channel){
        if (channel.cId === channelId){
            validChannel = true;
            currentChannel =  channel;
        }
    }
   

    //checking valid inputted channelId and uId 
    if (validChannel === false){
        return {error: 'error'};
    }
    
    
    //checking that start is not greater than the total number of messages in the channel
    if (currentChannel.messages.length < start){
        return {error: 'error'};
    }
    

    //checking the authUserId is a member of the channel 
    for (let user of data.user){
        if (user.authUserId === authUserId){
            if (user.channels.includes(channelId) === false) {
                return {error: 'error'};
            }
        }
    }

    let j = 0;
    for (let i = start; i < currentChannel.messages.length && j < 50; i++){
        messages[j] = currentChannel.messages[i];
        j++;
    }
    
    let end = start + 50;

    if (j !== 50){
        end = -1;
    }



    return { messages, start, end };
}

export { channelDetailsV1, channelJoinV1, channelInviteV1 , channelMessagesV1 };

