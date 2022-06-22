import { getData, setData } from './dataStore';

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
    let handleString = JSON.stringify(nameFirst);
    handleString += JSON.stringify(nameLast);
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
        'email': email,
        'password': password,
        'nameFirst': '${nameFirst}',
        'nameLast': '${nameLast}',
        'authUserId': uID,
        'channels': [],
        'handle': handleName,
    }
    setData(data);

    return { authUserId: uID };
}

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
