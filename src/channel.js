import { getData, setData } from "./dataStore.js";

// Given a channel with ID channelId that the authorised user is a member of, provide basic details about the channel.

// Arguments:
    // authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
    // channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>

// Return Value:
    // Returns <{name, isPublic, ownerMembers, allMembers}> on <valid input of authUserId and channelId>
    // Returns <{error: error}> on <channelId does not refer to a valid channel> 
    // Returns <{error: error}> on <when channelId is invalid> 
    // Returns <{error: error}> on <authorised user is not a member of the channel>

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
    const cId_index = data.user[user_index].channels.findIndex(object => {
        return object.cId === channelId;
    });

    // when the user is not a part of the channel error onject is returned
    if (cId_index === -1) {
        return error;
    }

    // store relevant information from the user into a return object
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
    // Returns {} on <valid input of authUserId and channelId>
    // Returns {error: error} on channelId does not refer to a valid channel, 
    // Returns {error: error} on the authorised user is already a member of the channel

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

    // Check to see if new user is a member
    let isGlobalMember = 0;
    if (data.user[user_index].permissionId === 1) {
        isGlobalMember = 1;
    }

    // Loops through the array members in the specified channel and checks
    // whether the authorised user is already a member of the channel,
    // if they are then error object is returned
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
    // if member is not a global owner and channel is private then return error 
    if (is_public === false && isGlobalMember === 0) {
        return error;
    }

    let addingChannel = { cId: channelId, channelPermissionId: 2,};

    // checking if the owner is a global owner and updating permissions if they are
    if (isGlobalMember === 1) {
        addingChannel.channelPermissionId = 1;
    } 

    // setting the push object to the user needs to be added to the members array for 
    // the particular channel
    let push_object = data.user[user_index];
    

    // User is able to join the channel and so members is updated within the channel's
    // member array and channels list is updated within the user's channels array
    data.user[user_index].channels.push(addingChannel);
    data.channel[channel_index].members.push(push_object);

    // updating the data in the data storage file
    setData(data);

    return return_object;
}



// Invites a user with ID uId to join a channel with ID channelId. Once invited, the user is added
//  to the channel immediately. In both public and private channels, all members are able to invite users.

// Arguments:
    // authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
    // channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>
    // uId> (<integer>)    - <This is the unique ID given to a a user once they are registered. It is the same as the users authUserId>

// Return Value:
    // Returns <{}> on <valid input of authUserId, channelId and uId>
    // Returns <{error: error}> on channelId does not refer to a valid channel, 
    // Returns <{error: error}> when uId does not refer to a valid user
    // Returns <{error: error}> when uId refers to a user who is already a member of the channel 
    // Returns <{error: error}> on authorised user is not a member of the channel

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
            let j = i;
            let isGlobalMember = 2;
            if (data.user[j].permissionId === 1) {
                isGlobalMember = 1;
            } 
            let push_object = { cId: channelId, channelPermissionId: isGlobalMember, }
            data.user[i].channels.push(push_object);
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



// Given a channel with ID channelId that the authorised user is a member of, return
// up to 50 messages between index "start" and "start + 50".

// Arguments:
    // authUserId> (<integer>)    - <This is the unique ID given to a user once they are registered>
    // channelId> (<integer>)    - <This is the unique ID given to a channel once it has been created>
    // start> (<integer>)    - <This is an integer given from the user>

// Return Value:
    // Returns <{ messages, start, end}> on <valid input of authUserId, channelId and uId>
    // Returns <{error: error}> on channelId does not refer to a valid channel, 
    // Returns <{error: error}> start is greater than the total number of messages in the channel
    // Returns <{error: error}> on authorised user is not a member of the channel



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
    let flag = false;
    for (let user of data.user){
        if (user.authUserId === authUserId){
            /*if (user.channels.includes(channelId) === false) {
                return {error: 'error'};
            }*/

            for (let channel of user.channels) {
                if (channel.cId === channelId) {
                    flag = true;
                }
            }
           
        }
    } 
    if (flag === false) {
        return {error: 'error'}
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

