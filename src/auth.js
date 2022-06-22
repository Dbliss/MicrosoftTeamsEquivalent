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
    const uID = Date.now();
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
    for (let i = 0; i < data.user.length; i++) {
        // check to see if email is in database
        if (email === data.user[i].email) {
            // check to see if password matches email in database
            if (password === data.user[i].password) {
                return { authUserId: data.user[i].authUserId }
            } else {
                return { error: 'error' };
            }
        } else {
            return { error: 'error' };
        }
    }
}

export { authRegisterV1, authLoginV1 }
