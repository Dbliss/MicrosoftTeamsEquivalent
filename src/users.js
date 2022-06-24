import {
  getData,
  setData,
} from './dataStore.js';

//<For a valid user, returns information about their userId, email, first name, last name, and handle> 

// Arguments:
    // <authUserId> (<integer>)    - <This is the unique number given to a user once registered and is the number for the person looking for information>
    // <uId> (<integer>)    - <This is the unique number given to a user once registered and is the number of the user if valid whose details is being sought>


// Return Value:
    // Returns <{user}> on <valid input of authUserId and uId>
    // Returns <{error: error}> on <invalid input of authUserId or invalid uId>

function userProfileV1(authUserId, uId) {
  let data = getData();
  let return_user = {};
  let error = {error: 'error'};
  
  // Finds the index of the object which contains the apropriate authUserId matching uId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const uId_index = data.user.findIndex(object => {
      return object.authUserId === uId;
  });

  // Finds the index of the object which contains the apropriate authUserId of uId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const user_index = data.user.findIndex(object => {
      return object.authUserId === authUserId;
  }); //code adapted from the website shorturl.at/eoJKY

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if ((user_index === -1) || (uId_index === -1)) {
      return error;
  }
 
  // Setting the values of the returned user object with the necessary details
  let retuId = data.user[uId_index].authUserId;
  return_user.uId = retuId;
  return_user.email = data.user[uId_index].email;
  return_user.nameFirst = data.user[uId_index].nameFirst;
  return_user.nameLast = data.user[uId_index].nameLast;
  return_user.handleStr = data.user[uId_index].handle;
  
  return return_user; 
}

export { userProfileV1 };