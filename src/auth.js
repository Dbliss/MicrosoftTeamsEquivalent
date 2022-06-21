import { getData, setData } from './dataStore';

function isDuplicateEmail(email) { 
    for (const user of getData().users) {
        if (user.email === email) {
            return true;
        } 
    }
    return false;
}

// Returns a string concatination of the input arguments 'email', 'password', 'nameFirst' and 'nameLast'
function authRegisterV1(email, password, nameFirst, nameLast) {
    // test for valid email i.e whether it has @ or .
    const emailTest = JSON.stringify(email);
    if (emailTest.includes('@') != true || emailTest.includes('.') != true) {
        return { error: 'error' };
    } else {
        // test for duplicate emails in database
        if (isDuplicateEmail(email) === true) {
            return { error: 'error' };
        } else {
             // see if password length is less than 6 characters
            if (password.length < 6) {
                return { error: 'error' };
            } else {
                if (nameFirst.length < 1 || nameFirst.length > 50) {
                    return { error: 'error' };
                } else {
                    if (nameLast.length < 1 || nameLast.length > 50) {
                        return { error: 'error' };
                    } else {
                        // create userId by concatenating nameFirst and nameLast and making it lowercase
                        let handleString = JSON.stringify(nameFirst);
                        handleString += JSON.stringify(nameLast);
                        let handleName = handleString.toLowerCase();
                        // add for loop for taken handles
                        let i = 0;
                        for (const user of getData().users) {
                            if (user.handle === handleName) {
                                handleName = handleName + i;
                                i++;
                            } 
                        }
                        const uID = Date.now(); 
                        const data = getData();
                        data.users[email] = {
                            name: '${nameFirst} ${nameLast}',
                            password: password,
                            handle: handleName,
                            userID: uID,
                        }
                        setData(data);
                        return {
                            authUserId: uID,
                        }
                    }
                }
            }
        } 
    }
}
// Returns a string concatination of the input arguments 'email' and 'password 
function authLoginV1(email, password) {

    return 'email' + 'password';
}
export { authRegisterV1, authLoginV1 }
