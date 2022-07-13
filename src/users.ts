import { getData } from './dataStore';

// <For a valid user, returns information about their userId, email, first name, last name, and handle>

// Arguments:
// <authUserId> (<integer>)    - <This is the unique number given to a user once registered and is the number for the person looking for information>
// <uId> (<integer>)    - <This is the unique number given to a user once registered and is the number of the user if valid whose details is being sought>

// Return Value:
// Returns <{user}> on <valid input of authUserId and uId>
// Returns <{error: error}> on <invalid input of authUserId or invalid uId>

function userProfileV1(authUserId: number, uId: number) {
  const data = getData();
  const returnUser = {
    user: {
      uId: 0,
      email: '',
      nameFirst: '',
      nameLast: '',
      handleStr: ''
    }
  };
  const error = { error: 'error' };

  // Finds the index of the object which contains the apropriate authUserId matching uId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const uIdIndex = data.user.findIndex(object => {
    return object.authUserId === uId;
  });

  // Finds the index of the object which contains the apropriate authUserId of uId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const userIndex = data.user.findIndex(object => {
    return object.authUserId === authUserId;
  }); // code adapted from the website shorturl.at/eoJKY

  // if neither the authUserId nor the channelId is valid then the function
  // returns an error object
  if ((userIndex === -1) || (uIdIndex === -1)) {
    return error;
  }

  // Setting the values of the returned user object with the necessary details
  const retuId = data.user[uIdIndex].authUserId;
  returnUser.user.uId = retuId;
  returnUser.user.email = data.user[uIdIndex].email;
  returnUser.user.nameFirst = data.user[uIdIndex].nameFirst;
  returnUser.user.nameLast = data.user[uIdIndex].nameLast;
  returnUser.user.handleStr = data.user[uIdIndex].handle;

  return returnUser;
}

export { userProfileV1 };
