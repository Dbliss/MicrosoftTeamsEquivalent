function userProfileV1(authUserId, uId) {
  let data = getData();
  let return_user = {};

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

  return_user.uId = data.user[user_index].authUserId;
  return_user.email = data.user[user_index].email;
  return_user.nameFirst = data.user[user_index].nameFirst;
  return_user.nameLast = data.user[user_index].nameLast;
  return_user.handleStr = data.user[user_index].handle;

  return return_object
  
}

export { userProfileV1 }