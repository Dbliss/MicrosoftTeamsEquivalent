import { getData, setData } from './dataStore';

// Given a user's first and last name, email address, and password, create a new account for them and return a new `authUserId`.
// Arguments:
// email (string) - This is the email string the user uses to register their account with
// password (string) - This is password string the user uses to register their account with
// nameFirst (string) - This is first name the user would like to register their account with
// nameLast (string) - This is last name the user would like to register their account with

//Return Values:
// Returns { authUserId } (integer) on valid email, password, nameFirst and nameLast
// Returns { error: 'error' } on invalid email parameter - email must contain @ or .
// Returns { error: 'error' } on invalid password - password must be greater than 6 characters
// Returns { error: 'error' } on invalid nameFirst - nameFirst must be in between 1 and 50 characters inclusive
// Returns { error: 'error' } on invalid nameLast - nameLast must be in between 1 and 50 characters inclusive


function authRegisterV1(email, password, nameFirst, nameLast) {
    
    // check for valid email parameter
    const emailTest = JSON.stringify(email);
    if (emailTest.includes('@') != true || emailTest.includes('.') != true) {
        return { error: 'error' };
    }

    // check for password parameter - is it less than 6 characters
    if (password.length < 6) {
        return { error: 'error' };
    }

    // check for nameFirst parameter - less than 1 character or more than 50 characters
    if (nameFirst.length < 1 || nameFirst.length > 50) {
        return { error: 'error' };
    }

    // check for nameLast parameter - less than 1 character or more than 50 characters
    if (nameLast.length < 1 || nameLast.length > 50) {
        return { error: 'error' };
    }

    // concatenate handle 
    let handleString = nameFirst + nameLast;
    let handleName = handleString.toLowerCase();
    // check for duplicate email and duplicate handle
    const data = getData();
    let k = 0;
    for (let i = 0; i < data.user.length; i++) {
        if (email === data.user[i].email) {
            return { error: 'error' };
        }
        if (handleName === data.user[i].handle) {
            handleName = handleName + k;
            k++;
        }

    }

    // make unique uID and store data
    const uID = Math.floor(Math.random() * Date.now());
    let j = data.user.length;
    data.user[j] = {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
        authUserId: uID,
        channels: [],
        handle: handleName,
    }
    setData(data);

    return { authUserId: uID };
}

// Given a registered user's email and password, returns their `authUserId` value
// Arguments: 
// email (string) - This is the email string the user uses to log into their registered account with
// password (string) - This is password string the user uses to log into their registered account with

// Return values:
// Returns { authUserId } (integer) on valid email and password
// Returns { error: 'error' } on invalid email - email must already be registered in the database
// Returns { error: 'error' } on invalid password - The password must match the one in the database under the specific email 


function authLoginV1(email, password) {
    const data = getData();
    // counter to keep track of each index that is checked for dupe email
    let k = 0;
    for (let i = 0; i < data.user.length; i++) {
        // check to see if email is in index
        if (email !== data.user[i].email) {
            k++;
        }
    }
    // if the for loop as gone to the end and there is no matches then return error object
    if (k = data.user.length - 1) {
        return { error: 'error' };
    }
    for (let j = 0; j < data.user.length; j++) {
        if (email === data.user[j].email) {
            // check to see if password matches email in database
            if (password === data.user[j].password) {
                return { authUserId: data.user[j].authUserId }
            } else {
                return { error: 'error' };
            }
        }
    }
} 
        
    


export { authRegisterV1, authLoginV1 }
