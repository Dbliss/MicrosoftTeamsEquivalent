// Function to create a new channel with the passed name and assign if it is public or not. User(authUserId) is added to the channel by default

// Arguments:
// authUserId (integer) - User ID of the user creating the channel
// name (string) - Name of the new channel
// isPublic (boolean) - States if channel is public or private

// Return Values:
// Returns {channelId: <channelId>} (integer) on valid authUserId and name
// Returns {error: 'error'} on invalid authUserId - Being authUserId does not exist
// Returns {error: 'error'} on invalid name - name must be in between 1 and 20 characters inclusive  

function channelsCreateV1(authUserId, name, isPublic) {
  return {
    channelId: 1,
  };
}

// Function to list channels with their details that user is part of

// Arguments:
// authUserId (integer) - User ID of the user listing the channels

// Return Values:
// Returns {channels: []} on invalid authUserId
// Returns {channels: [{
//                        channelId: <ID of channel>,
//                        name: <name of channel> },] } on valid inputs


function channelsListV1(authUserId) {
  return {
    channels: [] // see interface for contents
  };
}

// Function to list all channels with their details

// Arguments:
// authUserId (integer) - User ID of the user listing the channels

// Return Values:
// Returns {channels: []} on invalid authUserId
// Returns {channels: [{
//                        channelId: <ID of channel>,
//                        name: <name of channel> },] } on valid inputs

function channelsListallV1(authUserId) {
  return {
    channels: [] // see interface for contents
  };
}

export { channelsCreateV1, channelsListV1, channelsListallV1 };
