import {
  getData,
  setData,
} from './dataStore.js';


function userProfileV1(authUserId, uId) {
  let data = getData();
  let return_user = {};
  let error = {error: 'error'};
  
  const uId_index = data.user.findIndex(object => {
      return object.authUserId === uId.authUserId;
  });

  // The code finds the index of the object which contains the apropriate authUserId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const user_index = data.user.findIndex(object => {
      return object.authUserId === authUserId.authUserId;
  }); //code adapted from the website shorturl.at/eoJKY

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if ((user_index === -1) || (uId_index === -1)) {
      return error;
  }
 
  let retuId = data.user[uId_index].authUserId;
  return_user.uId = {authUserId: retuId};
  return_user.email = data.user[uId_index].email;
  return_user.nameFirst = data.user[uId_index].nameFirst;
  return_user.nameLast = data.user[uId_index].nameLast;
  return_user.handleStr = data.user[uId_index].handle;

  
  
  
  

  return return_user;
  
}

export { userProfileV1 };