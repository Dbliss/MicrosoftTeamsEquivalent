import { authLoginV1, authRegisterV1 } from './auth';
import { clearV1 } from './other'

test('Test successful returns authUserId', () => {
    clearV1();
    let result = authRegisterV1('z5364121@unsw.edu.au', 'banana', 'Thevindu', 'Hewa');
    expect(result).toMatchObject({ authUserId: expect.any(Number)});
});

test('Invalid email', () => {
    clearV1();
    let result = authRegisterV1('z5364121unsw.edu.au', 'banana', 'Thevindu', 'Hewa');
    expect(result).toMatchObject({ error: 'error' });
    result = authRegisterV1('z5364121@unsweduau', 'banana', 'Thevindu', 'Hewa');
    expect(result).toMatchObject({ error: 'error' });
});

test('error when email is being used by another user', () => {
    clearV1();
    authRegisterV1('z5364121@unsw.edu.au', 'banana', 'Thevindu', 'Hewa');
    let result = authRegisterV1('z5364121@unsw.edu.au', 'banana', 'Thev', 'Hewa');
    expect(result).toMatchObject({ error: 'error' });
});

test('password length less than 6 characters', () => {
    clearV1();
    let result = authRegisterV1('z5364121@unsw.edu.au', 'apple', 'Thev', 'Hewa');
    expect(result).toMatchObject({ error: 'error' });
});

test('length of nameFirst is not between 1 and 50 characters inclusive', () => {
    clearV1();
    let result = authRegisterV1('z5364121@unsw.edu.au', 'apple', '', 'Hewa');
    expect(result).toMatchObject({ error: 'error' });
    result = authRegisterV1('z5364121@unsw.edu.au', 'apple', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', 'Hewa');
    expect(result).toMatchObject({ error: 'error' });
});

test('length of nameLast is not between 1 and 50 characters inclusive', () => {
    clearV1();
    let result = authRegisterV1('z5364121@unsw.edu.au', 'apple', 'Thev', '');
    expect(result).toMatchObject({ error: 'error' });
    result = authRegisterV1('z5364121@unsw.edu.au', 'apple', 'Thev', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz');
    expect(result).toMatchObject({ error: 'error' });
});
