import validator from 'validator';
import { dataType, getData, setData } from './dataStore';
import { getHashOf } from './other';
import HTTPError from 'http-errors';

// Given a user's first and last name, email address, and password, create a new account for them and return a new `authUserId`.
// Arguments:
// email (string) - This is the email string the user uses to register their account with
// password (string) - This is password string the user uses to register their account with
// nameFirst (string) - This is first name the user would like to register their account with
// nameLast (string) - This is last name the user would like to register their account with

// Return Values:
// Returns { authUserId } (integer) on valid email, password, nameFirst and nameLast
// Returns { error: 'error' } on invalid email parameter - email must contain @ or .
// Returns { error: 'error' } on invalid password - password must be greater than 6 characters
// Returns { error: 'error' } on invalid nameFirst - nameFirst must be in between 1 and 50 characters inclusive
// Returns { error: 'error' } on invalid nameLast - nameLast must be in between 1 and 50 characters inclusive

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
  // check for valid email parameter

  if (validator.isEmail(email) !== true) {
    throw HTTPError(400, 'Invalid email');
  }

  // check for password parameter - is it less than 6 characters
  if (password.length < 6) {
    throw HTTPError(400, 'Invalid password');
  }

  // check for nameFirst parameter - less than 1 character or more than 50 characters
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    throw HTTPError(400, 'Invalid first name');
  }

  // check for nameLast parameter - less than 1 character or more than 50 characters
  if (nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, 'Invalid last name');
  }

  // concatenate handle
  const handleString = nameFirst + nameLast;
  let handleName = handleString.toLowerCase();
  // check for duplicate email and duplicate handle
  const data: dataType = getData();
  let k = 0;
  for (let i = 0; i < data.user.length; i++) {
    if (email === data.user[i].email) {
      throw HTTPError(400, 'Duplicate email');
    }
    if (handleName === data.user[i].handle) {
      handleName = handleName + k;
      k++;
    }
  }

  // make unique uID and store data
  const uID = Math.floor(Math.random() * Date.now());
  let permissionId = 2;
  if (data.user[0] === undefined) {
    permissionId = 1;
  }
  // generate token and store
  const rand = () => {
    return Math.random().toString(36).substr(2);
  };
  const tokenGenerate = () => {
    return rand() + rand();
  };

  const token = getHashOf(tokenGenerate());

  const j = data.user.length;
  data.user[j] = {
    email: email,
    password: getHashOf(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    authUserId: uID,
    channels: [],
    handle: handleName,
    permissionId: permissionId,
    token: [],
  };
  data.user[j].token.push(token);
  setData(data);

  return { token: token, authUserId: uID };
}

// Given a registered user's email and password, returns their `authUserId` value
// Arguments:
// email (string) - This is the email string the user uses to log into their registered account with
// password (string) - This is password string the user uses to log into their registered account with

// Return values:
// Returns { authUserId } (integer) on valid email and password
// Returns { error: 'error' } on invalid email - email must already be registered in the database
// Returns { error: 'error' } on invalid password - The password must match the one in the database under the specific email

function authLoginV1(email: string, password: string) {
  const data:dataType = getData();
  // counter to keep track of each index that is checked for dupe email
  let emailCheck = false;
  let userIndex = -1;
  for (let i = 0; i < data.user.length; i++) {
    // check to see if email is in index
    if (email === data.user[i].email) {
      emailCheck = true;
      userIndex = i; 
    }
  }
  // if the for loop as gone to the end and there is no matches then return error object
  if (emailCheck === false) {
    throw HTTPError(400, 'Email does not belong to any user');
  }
  
  if (getHashOf(password) === data.user[userIndex].password) {
    // generate token and store
    const rand = () => {
      return Math.random().toString(36).substr(2);
    };
    const tokenGenerate = () => {
      return rand() + rand();
    };
    const token = tokenGenerate();

    data.user[userIndex].token.push(getHashOf(token));
    setData(data);

    return { token: token, authUserId: data.user[userIndex].authUserId };
  } else {
      throw HTTPError(400, 'Incorrect password');
  }
}
  

// Given an active token, invalidates the token to log the user out
// Arguments:
// token (string) - This is the token string the user uses to log out of their current session

// Return values:
// Returns {} on successful logout
// Returns { error: 'error' } on invalid token - token must be stored under user's data

const authLogoutV1 = (token: string) => {
  const data:dataType = getData();
  const hashedToken = getHashOf(token);
  // validate token by searching through all tokens associated with all users
  for (let i = 0; i < data.user.length; i++) {
    for (let j = 0; j < data.user[i].token.length; j++) {
      // if there is a match, invalidate it by splicing the value out
      if (hashedToken === data.user[i].token[j]) {
        const index = data.user[i].token.indexOf(hashedToken);
        if (index > -1) {
          data.user[i].token.splice(index, 1);
          setData(data);
          return {};
        }
      }
    }
  }
  throw HTTPError(403, 'Invalid token');
};

export { authRegisterV1, authLoginV1, authLogoutV1 };
