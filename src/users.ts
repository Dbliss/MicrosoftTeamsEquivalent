import validator from 'validator';
import { dataType, getData, setData, userType } from './dataStore';
import HTTPError from 'http-errors';
import { getIndexOfStatsUid, involvementRateCalc, utilizationRateCalc } from './other';
import fs from 'fs';
import request from 'sync-request';

// const error = { error: 'error' };

// Helper function that takes all the fields stored in a users and picks relevent information for
// the user object
function extractUserDetails (user: userType) {
  const returnUser =
  {
    uId: user.authUserId,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    handleStr: user.handle,
    profileImgUrl: user.profileImgUrl,
  };

  return returnUser;
}

// Helper Function which finds the user which has the token,
// if not then -1 is returned meaning token does not exist
function getTokenIndex(token: string, data: dataType) {
  const hashedToken = token;
  const tokenIndex = data.user.findIndex((object: any) => {
    for (const tokenElem of object.token) {
      if (tokenElem === hashedToken) {
        return tokenElem === hashedToken;
      }
    }
    return false;
  });
  return tokenIndex;
}

// <For a valid token, returns information about their userId, email, first name, last name, and handle>

// Arguments:
// <authUserId> (<integer>)    - <This is the unique number given to a user once registered and is the number for the person looking for information>
// <uId> (<integer>)    - <This is the unique number given to a user once registered and is the number of the user if valid whose details is being sought>

// Return Value:
// Returns <{user}> on <valid input of authUserId and uId>
// Returns <{error: error}> on <invalid input of authUserId or invalid uId>

function userProfileV1(token: string, uId: number) {
  const data = getData();

  const returnUser = {
    user:
    {
      uId: 0,
      email: '',
      nameFirst: '',
      nameLast: '',
      handleStr: ''
    }
  };

  // Finds the index of the object which contains the apropriate authUserId matching uId, in the user key array,
  // and stores it within a variable. If not found -1 is stored
  const uIdIndex = data.user.findIndex((object: any) => {
    return object.authUserId === uId;
  });

  // Checks if the token exists and returns the index of the user which has that token,
  // if noy found then returns -1
  const tokenIndex = getTokenIndex(token, data); // code adapted from the website shorturl.at/eoJKY

  // if neither the token nor the uId is found then the function
  // returns an error object

  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid token entered');
  }

  if ((uIdIndex === -1)) {
    throw HTTPError(400, 'Invalid uId');
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

// <For a valid token, an array of all the users in the system>

// Arguments:
// <token> (<string>)    - <This is the unique string given to each session for a user>
// <uId> (<integer>)    - <This is the unique number given to a user once registered and is the number of the user if valid whose details is being sought>

// Return Value:
// Returns <{users}> on <valid input of authUserId and uId>
// Returns {error: 'error'} on <invalid token>
function usersAllV1 (token: string) {
  const data:dataType = getData();
  // Checks if the token exists and returns the index of the user which has that token,
  // if not found then returns -1
  const tokenIndex = getTokenIndex(token, data);

  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid token entered');
  }
  const usersArray = [];
  for (const user of data.user) {
    if (user.nameFirst !== 'Removed' && user.nameLast !== 'user') { // checking to see if the user has been removed or not
      usersArray.push(extractUserDetails(user));
    }
  }

  const returnUserArray = { users: usersArray };
  return returnUserArray;
}

// <For a valid token, nameFirst and nameLast, changes tehe suers first and last name in all of
// their instances within the data. including members of channels>

// Arguments:
// <token> (<integer>)    - <This is the unique string given to each session for a user>
// <nameFirst> (<integer>)    - <New first name to be changed for the user>
// <nameLast> (<integer>)    - <New last name to be changed for the user>

// Return Value:
// Returns <{empty object - {}}> on <valid input of authUserId and uId>
// Returns {error: 'error'} on <invalid token>
// Returns {error: 'error'} on <invalid nameFirst>
// Returns {error: 'error'} on <invalid nameLast>
function userProfileSetNameV1 (token: string, nameFirst: string, nameLast: string) {
  const data = getData();
  if ((nameFirst.length > 50) || (nameFirst.length < 1)) {
    throw HTTPError(400, 'First name is not valid length');
  }

  if ((nameLast.length > 50) || (nameLast.length < 1)) {
    throw HTTPError(400, 'Last name is not valid length');
  }

  // Checks if the token exists and returns the index of the user which has that token,
  // if not found then returns -1
  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    throw HTTPError(403, 'Invalid token entered');
  }

  // locating the user and changing the first and last name, then checking the users channels and changing their name there or just updating the object at that location

  // could I just call this function on the user object within the members array
  data.user[tokenIndex].nameFirst = nameFirst;
  data.user[tokenIndex].nameLast = nameLast;

  // for (const channel of userChannels) {
  //   const channelId = channel.cId;
  //   const channelIndex = data.channel.findIndex((object: any) => {
  //     return object.cId === channelId;
  //   });
  //   const ownerIndex = data.channel[channelIndex].owners.findIndex((object: any) => {
  //     return object.authUserId === updatedUser.uId;
  //   });
  //   const memberIndex = data.channel[channelIndex].members.findIndex((object: any) => {
  //     return object.authUserId === updatedUser.uId;
  //   });

  //   const perms = channel.channelPermissionsId;
  //   if (perms === 1) {
  //     data.channel[channelIndex].owners[ownerIndex] = updatedUser;
  //     data.channel[channelIndex].members[memberIndex] = updatedUser;
  //   } else {
  //     data.channel[channelIndex].members[memberIndex] = updatedUser;
  //   }
  // }

  setData(data);
  return {};
}

// <For a valid token and email, changes a particular user's email, in all instances of its existance in the data set>

// Arguments:
// <token> (<integer>)    - <This is the unique string given to each session for a user>
// <email> (<string>)    - <New email to replace the users current email>

// Return Value:
// Returns <{empty object - {}}> on <valid input of token and email>
// Returns {error: 'error'} on <invalid token>
// Returns {error: 'error'} on <invalid email>
function userProfileSetEmailV1 (token: string, email: string) {
  const data = getData();

  const tokenIndex = getTokenIndex(token, data);

  if ((tokenIndex === -1)) {
    throw HTTPError(403, 'Invalid token entered');
  }

  if (!(validator.isEmail(email))) {
    throw HTTPError(400, 'Email enetered is not valid');
  }

  const emailIndex = data.user.findIndex((object: any) => {
    return object.email === email;
  });

  // if the input email already exists return error
  if (emailIndex !== -1) {
    throw HTTPError(400, 'Email entered is already being used');
  }

  data.user[tokenIndex].email = email;
  // for (const channel of userChannels) {
  //   const channelId = channel.cId;
  //   const channelIndex = data.channel.findIndex((object: any) => {
  //     return object.cId === channelId;
  //   });
  //   const ownerIndex = data.channel[channelIndex].owners.findIndex((object: any) => {
  //     return object.authUserId === updatedUser.uId;
  //   });
  //   const memberIndex = data.channel[channelIndex].members.findIndex((object: any) => {
  //     return object.authUserId === updatedUser.uId;
  //   });

  //   const perms = channel.channelPermissionsId;
  //   if (perms === 1) {
  //     data.channel[channelIndex].owners[ownerIndex] = updatedUser;
  //     data.channel[channelIndex].members[memberIndex] = updatedUser;
  //   } else {
  //     data.channel[channelIndex].members[memberIndex] = updatedUser;
  //   }
  // }
  setData(data);
  return {};
}

// Arguments:
// <token> (<string>)    - <This is the unique string given to each session for a user>
// <handleStr> (<string>)    - <New email to replace the users current email>

// Return Value:
// Returns <{empty object - {}}> on <valid input of token and handleStr>
// Returns {error: 'error'} on <invalid token>
// Returns {error: 'error'} on <invalid handleStr>
function userProfileSetHandleV1 (token: string, handleStr: string) {
  const data = getData();

  const tokenIndex = getTokenIndex(token, data);

  // if neither the token nor the uId is found then the function
  // returns an error object
  if ((tokenIndex === -1)) {
    throw HTTPError(403, 'Invalid token entered');
  }

  if ((handleStr.length < 3) || (handleStr.length > 20)) {
    throw HTTPError(400, 'Hendle is not valid length');
  }

  const handleIndex = data.user.findIndex((object: any) => { // check whether the hadndle is already being used
    return object.handle === handleStr;
  });

  if (handleIndex !== -1) {
    throw HTTPError(400, 'Handle entered is already being used');
  }

  // if (handleStr.match(/^[0-9A-Za-z]+$/) === null) { // idk if this works, coded adapted from: https://tinyurl.com/2ps8ms94
  //   // handleStr not alphanumeric
  //   throw HTTPError(400, 'Handle constians non-alphanumeric characters');
  // }

  data.user[tokenIndex].handle = handleStr;
  // for (const channel of userChannels) {
  //   const channelId = channel.cId;
  //   const channelIndex = data.channel.findIndex((object: any) => {
  //     return object.cId === channelId;
  //   });
  //   const ownerIndex = data.channel[channelIndex].owners.findIndex((object: any) => {
  //     return object.authUserId === updatedUser.uId;
  //   });
  //   const memberIndex = data.channel[channelIndex].members.findIndex((object: any) => {
  //     return object.authUserId === updatedUser.uId;
  //   });

  //   const perms = channel.channelPermissionsId;
  //   if (perms === 1) {
  //     data.channel[channelIndex].owners[ownerIndex] = updatedUser;
  //     data.channel[channelIndex].members[memberIndex] = updatedUser;
  //   } else {
  //     data.channel[channelIndex].members[memberIndex] = updatedUser;
  //   }
  // }
  setData(data);
  return {};
}

// Arguments:
// <imgUrl> (<string>)    - <This is the unique string given to each session for a user>
// <xStart> (<string>)    - <New email to replace the users current email>
// <yStart> (<string>)    - <New email to replace the users current email>
// <xEnd> (<string>)    - <New email to replace the users current email>
// <yEnd> (<string>)    - <New email to replace the users current email>

// Return Value:
// Returns <{empty object - {}}> on <valid input of token and handleStr>
export function userUploadPhoto (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  const data:dataType = getData();
  // Checking if the token is valid
  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    if ((tokenIndex === -1)) {
      throw HTTPError(403, 'Invalid token entered');
    }
  }
  const uId = data.user[tokenIndex].authUserId;

  // CHECKING IF THE URL IS VALID AND IS A jpeg (check the jpeg using the end of the url string and see if the last 4 characters is .jpeg)
  const loweredUrl = imgUrl.toLowerCase();
  if (!(loweredUrl.includes('jpeg') || loweredUrl.includes('jpg'))) {
    throw HTTPError(400, 'Image uploaded is not a JPG');
  }
  // DOING A GET REQUEST ON THE IMAGE URL AND SEEING IF IT IS VALID
  const res = request(
    'GET',
    imgUrl
  );
  if (res.statusCode !== 200) {
    throw HTTPError(400, 'Invalid imgUrl entered');
  }

  // CHECK IF THE DIMENSIONS OF CROPPING ARE VALID
  if (xEnd <= xStart || yEnd <= yStart) {
    throw HTTPError(400, 'Invalid dimensions');
  }

  const imgBody = res.getBody();
  fs.writeFileSync(`src/profileImages/${uId}.jpg`, imgBody, { flag: 'w' });

  const sizeOf = require('image-size');
  const dimensions = sizeOf(`src/profileImages/${uId}.jpg`);
  console.log(dimensions.width, dimensions.height);

  if (dimensions.width < xEnd || dimensions.height < yEnd) {
    throw HTTPError(400, 'dimensions do not fit the image');
  }
  // STORE THE CONTENTS OF THE IMAGE IN A FILE AND NAME IT THEIR Uid
  // CROP THE IMAGE

  // EDIT THE PICTURE AND STORE IT IN THE FILE images USING ITS UID AS A NAME
  const Jimp = require('jimp');

  async function crop() { // Function name is same as of file name
    // Reading Image
    const image = await Jimp.read(`src/profileImages/${uId}.jpg`);
    image.crop(xStart, yStart, xEnd - xStart, yEnd - yStart).write(`src/profileImages/${uId}.jpg`);
  }
  crop();

  const generatedUrl = `h17bdream.alwaysdata.net/imgurl/${uId}.jpg`;
  data.user[tokenIndex].profileImgUrl = generatedUrl;

  // Calling the function here using async
  // HAVE A RANDOM GENERIC IMAGE AS THE IMAGE THAT ALL USERS WILL HAVE INITIALLY

  // CREATE THE URL FOR THE IMAGE THEN CALL THE URL (USING SOME KIND OF REQUEST)
  // SO THAT THET PICTURE IS SENT TO THE SERVER

  // STORE THE URL OF THE CREATED URL IN THE USER
}

// Arguments:
// <token> (<string>)    - <This is the unique string given to each session for a user>
// <handleStr> (<string>)    - <New email to replace the users current email>

// Return Value:
// Returns <{empty object - {}}> on <valid input of token and handleStr>
// Returns {error: 'error'} on <invalid token>
// Returns {error: 'error'} on <invalid handleStr>
export function userStats (token: string) {
  const data: dataType = getData();
  const tokenIndex = getTokenIndex(token, data);
  if (tokenIndex === -1) {
    if ((tokenIndex === -1)) {
      throw HTTPError(403, 'Invalid token entered');
    }
  }

  const statsIndex = getIndexOfStatsUid(data, token);

  const returnObject = {
    channelsJoined: [...data.stats[statsIndex].channelsJoined],
    dmsJoined: [...data.stats[statsIndex].dmsJoined],
    messagesSent: [...data.stats[statsIndex].messagesSent],
    involvementRate: involvementRateCalc(token, data),
  };
  return ({ userStats: returnObject });
}

// Arguments:
// <token> (<string>)    - <This is the unique string given to each session for a user>
// <handleStr> (<string>)    - <New email to replace the users current email>

// Return Value:
// Returns <{empty object - {}}> on <valid input of token and handleStr>
// Returns {error: 'error'} on <invalid token>
// Returns {error: 'error'} on <invalid handleStr>
export function usersStats (token: string) {
  const data: dataType = getData();
  const tokenIndex = getTokenIndex(token, data);

  if ((tokenIndex === -1)) {
    throw HTTPError(403, 'Invalid token entered');
  }

  const returnObject = {
    channelsExist: [...data.workSpaceStats.channelsExist],
    dmsExist: [...data.workSpaceStats.dmsExist],
    messagesExist: [...data.workSpaceStats.messagesExist],
    utilizationRate: utilizationRateCalc(data),
  };

  return { workspaceStats: returnObject };
}

export { userProfileV1, usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1, getTokenIndex };
