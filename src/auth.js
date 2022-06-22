import { getData, setData } from './dataStore';



// Returns a string concatination of the input arguments 'email', 'password', 'nameFirst' and 'nameLast'
function authRegisterV1(email, password, nameFirst, nameLast) {
    // test for valid email i.e whether it has @ or .
    const emailTest = JSON.stringify(email);
    if (emailTest.includes('@') != true || emailTest.includes('.') != true) {
        return { error: 'error' };
    } else {
        // test for duplicate emails in database
        const data = getData();
        if (email in data.users) {
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
                        const data = getData();
                        for (const user of data.users) {
                            if (handleName === data.users[handle]) {
                                handleName = handleName + i;
                                i++;
                            } 
                        }
                        const uID = Date.now(); 
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
    const data = getData();
    if (!(email in data.users)) {
        return { error: 'error' };
    } else {
        if (data.users[email].password !== password) {
            return { error: 'error' };
        } else {
            return { authUserId: data.users[email].userID, }
        }
    }
}

export { authRegisterV1, authLoginV1 }
