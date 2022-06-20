import { getData, setData } from './dataStore';

// Returns a string concatination of the input arguments 'email', 'password', 'nameFirst' and 'nameLast'
function authRegisterV1(email, password, nameFirst, nameLast) {
    // test for valid email i.e whether it has @ or .
    const emailTest = JSON.stringify(email);
    if (emailTest.includes('@') != true || emailTest.includes('.') != true) {
        return { error: 'error' };
    } else {
        const data = getData();
        // test for duplicate emails in database
        if ((email in data.users)) {
            return { error: 'error' };
        } else {
             // see if password length is less than 6 characters
            const passwordString = JSON.stringify(password);
            const passwordLength = passwordString.length;
            if (passwordLength < 6) {
                return { error: 'error' };
            } else {
                const firstnameString = JSON.stringify(nameFirst);
                const firstnameLength = firstnameString.length;
                if (firstnameLength < 1 || firstnameLength > 50) {
                    return { error: 'error' };
                } else {
                    const lastnameString = JSON.stringify(nameLast);
                    const lastnameLength = lastnameString.length;
                    if (lastnameLength < 1 || lastnameLength > 50) {
                        return { error: 'error' };
                    } else {
                        // create userId by concatenating nameFirst and nameLast and making it lowercase
                        const data = getData();
                        let handleString = JSON.stringify(nameFirst);
                        handleString += JSON.stringify(nameLast);
                        let handleName = handleString.toLowerCase();
                        // add for loop for taken handles
                        let i = 0;
                        for (const handle in data.users) {
                            if (handleName === handle) {
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

    return 'email' + 'password';
}
export { authRegisterV1, authLoginV1 }
