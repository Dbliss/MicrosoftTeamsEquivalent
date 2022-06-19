import { getData, setData } from './dataStore';

// Returns a string concatination of the input arguments 'email', 'password', 'nameFirst' and 'nameLast'
function authRegisterV1(email, password, nameFirst, nameLast) {
    // test for valid email i.e whether it has @ or .
    const emailTest = String(email);
    if (emailTest.includes('@') != true || emailTest.includes('.') != true) {
        return { error: 'error' };
    }
    const data = getData();
    // test for duplicate emails in database
    if (!(email in data.users)) {
        return { error: 'error' };
    }
    // see if password length is less than 6 characters
    const passwordLength = password.length;
    if (passwordLength < 6) {
        return { error: 'error' };
    }

    const firstnameLength = nameFirst.length;
    if (firstnameLength < 1 || firstnameLength > 50) {
        return { error: 'error' };
    }
    // create userId by concatenating nameFirst and nameLast and making it lowercase
    let uIdString = String(nameFirst);
    uIdString += String(nameLast);
    let uID = uIdString.toLowerCase();

    data.users[email] = {
        name: '${nameFirst} ${nameLast}',
        password: password,
        userId: uID,
    }
    setData(data);

    return {
        authUserId: data.users[email]['userId'],
    }
}
// Returns a string concatination of the input arguments 'email' and 'password 
function authLoginV1(email, password) {

    return 'email' + 'password';
}
export { authRegisterV1, authLoginV1 }
