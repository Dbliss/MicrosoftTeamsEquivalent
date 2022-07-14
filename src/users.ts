
import validator from 'validator';
import { getData, setData, userType } from './dataStore';
const error = { error: 'error' };

// <For a valid user, returns information about their userId, email, first name, last name, and handle>

// Arguments:
// <authUserId> (<integer>)    - <This is the unique number given to a user once registered and is the number for the person looking for information>
// <uId> (<integer>)    - <This is the unique number given to a user once registered and is the number of the user if valid whose details is being sought>

// Return Value:
// Returns <{user}> on <valid input of authUserId and uId>
// Returns <{error: error}> on <invalid input of authUserId or invalid uId>

function userProfileV1(token: string, uId: number) {
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

  // Finds the index of the object which contains the apropriate authUserId matching uId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const uIdIndex = data.user.findIndex(object => {
    return object.authUserId === uId;
  });

  // Checks if the token exists and returns the index of the user which has that token,
  // if noy found then returns -1
  const tokenIndex = data.user.findIndex(object => {
    for (const tokenElem of object.token) {
        if(tokenElem === token) {
            return tokenElem === token;
        }
    }
    return false; 
  }); // code adapted from the website shorturl.at/eoJKY

  // if neither the token nor the uId is found then the function
  // returns an error object
  if ((tokenIndex === -1) || (uIdIndex === -1)) {
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

// Helper function that takes all the fields stored in a users and picks relevent information for
// the user object
function extractUserDetails (user: userType) {


  const returnUser = {user: 
  {uId: user.authUserId,
  email: user.email,
  nameFirst: user.nameFirst,
  nameLast: user.nameLast,
  handleStr: user.handle,}
  }
  return returnUser;
}

function tokenIndexCheck (data, token) {
  // Checks if the token exists and returns the index of the user which has that token,
  // if noy found then returns -1
  const tokenIndex = data.user.findIndex(object => {
    for (const tokenElem of object.token) {
        if(tokenElem === token) {
            return tokenElem === token;
        }
    }
    return false; 
  }); // code adapted from the website shorturl.at/eoJKY

  if (tokenIndex === -1) {
    return error;
  }
  else return tokenIndex;
}

function updateUserInfo(data, channels, user) { // need to typescript channels as an array of channels
  for (const channel of channels) {
    const channelId = channel.cId;
    const channelIndex = data.channel.findIndex(object => {
      return object.cId === channelId;
    });
    const ownerIndex = data.channel[channelIndex].owners.findIndex(object => {
      return object.authUserId === user.authUserId;
    });
    const memberIndex = data.channel[channelIndex].members.findIndex(object => {
      return object.authUserId === user.authUserId;
    });

    const perms = channel.channelPermissionsId;
    if (perms === 1) {
      data.channel[channelIndex].owners[ownerIndex] = user;
      data.channel[channelIndex].members[memberIndex] = user; 
    }
    else {
      data.channel[channelIndex].members[memberIndex] = user;
    }
  }
}

function usersAllV1 (token: string) {
  const data = getData();
  // Checks if the token exists and returns the index of the user which has that token,
  // if noy found then returns -1
  const tokenIndex = data.user.findIndex(object => {
    for (const tokenElem of object.token) {
        if(tokenElem === token) {
            return tokenElem === token;
        }
    }
    return false; 
  }); // code adapted from the website shorturl.at/eoJKY

  if (tokenIndex === -1) {
    return error;
  }
  const usersArray = [];
  for (const user of data.user) {
    usersArray.push(extractUserDetails(user));
  }

  const returnUserArray = {users: usersArray};
  return returnUserArray;
}

function  userProfileSetNameV1 (token: string, nameFirst: string, nameLast: string) {
  const data = getData();
  if ((nameFirst.length > 50) || (nameFirst.length < 1)) {
    return error;
  }
  
  if ((nameLast.length > 50) || (nameLast.length < 1)) {
    return error;
  }

  // Checks if the token exists and returns the index of the user which has that token,
  // if not found then returns -1 
  const tokenIndex = tokenIndexCheck(data, token);
  if (tokenIndex === error) {
    return tokenIndex;
  }
  
  
  // locating the user and changing the first and last name, then checking the users channels and changing their name there or just updating the object at that location

  // could I just call this function on the user object within the members array
  data.user[tokenIndex].nameFirst = nameFirst;
  data.user[tokenIndex].nameLast = nameLast;
  const updatedUser = extractUserDetails(data.user[tokenIndex]);
  const userChannels = data.user[tokenIndex].channels;
  updateUserInfo(data, userChannels, updatedUser);

  setData(data);
}

function  userProfileSetEmailV1 (token: string, email: string) {
  const data = getData();

  const tokenIndex = tokenIndexCheck(data, token);
  if (tokenIndex === error) {
    return tokenIndex;
  }

  if(!(validator.isEmail(email))) {
    return error;
  }

  const userIndex = data.user.findIndex(object => {
    return object.email === email;
  });

  if (userIndex !== -1) {
    return error;
  }

  data.user[tokenIndex].email = email;
  const updatedUser = extractUserDetails(data.user[tokenIndex]);
  const userChannels = data.user[tokenIndex].channels;
  updateUserInfo(data, userChannels, updatedUser);

  setData(data);

}

function userProfileSetHandleV1 (token: string, handleStr: string) {
  const data = getData();

  const tokenIndex = tokenIndexCheck(data, token);
  if (tokenIndex === error) {
    return tokenIndex;
  }

  if((handleStr.length < 3) || (handleStr.length > 20)) {
    return error;
  }

  const handleIndex = data.user.findIndex(object => { //check whether the hadndle is already being used
    return object.handle === handleStr;
  });

  if (handleIndex !== -1) {
    return error;
  }

  if (handleStr.match(/^[0-9A-Za-z]+$/) === null) { //idk if this works, coded adapted from: https://tinyurl.com/2ps8ms94
    //handleStr not alphanumeric
    return error;
    }

  data.user[tokenIndex].handle = handleStr;
  const updatedUser = extractUserDetails(data.user[tokenIndex]);
  const userChannels = data.user[tokenIndex].channels;
  updateUserInfo(data, userChannels, updatedUser);
  setData(data);
}
export { userProfileV1, usersAllV1, userProfileSetNameV1, userProfileSetEmailV1 , userProfileSetHandleV1};
