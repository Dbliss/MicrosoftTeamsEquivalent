import {
  callingClear,
  // callingChannelDetails,
  // callingChannelJoin,
  callingUserProfile, callingUsersAll, callingUserProfileSetEmail, callingUserProfileSetHandle, callingUserProfileSetName, callingAuthRegister,
  // callingChannelsCreate
} from './helperFile';

const OK = 200;

// describe('Testing userProfileV1', () => {
//     test('Testing successful return of user object from userProfileV1', () => {
//       callingClear();
//       const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
//         'password',
//         'First',
//         'Last').getBody()));

//       const uId = JSON.parse(String(callingAuthRegister(
//         'email1@email.com',
//         'password1',
//         'First1',
//         'Last1').getBody()));

//       const result = JSON.parse(String(callingUserProfile(authUserId.authUserId, uId.authUserId).getBody()));
//       expect(result).toMatchObject({
//         user: {
//           uId: uId.authUserId,
//           email: 'email1@email.com',
//           nameFirst: 'First1',
//           nameLast: 'Last1',
//           handleStr: 'first1last1'
//         }
//       });
//     });

//     test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
//       callingClear();
//       const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
//         'password',
//         'First',
//         'Last').getBody()));

//       const uId = -9999;
//       const result = JSON.parse(String(callingUserProfile(authUserId.authUserId, uId).getBody()));
//       expect(result).toMatchObject({ error: 'error' });
//     });

//     test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
//       callingClear();
//       JSON.parse(String(callingAuthRegister('email@email.com',
//         'password',
//         'First',
//         'Last').getBody()));

//       const uId = JSON.parse(String(callingAuthRegister('email1@email.com',
//         'password',
//         'First1',
//         'Last1').getBody()));

//       const result = JSON.parse(String(callingUserProfile("-9999", uId.authUserId).getBody())); // Double check this, I changed the input to a string number
//       expect(result).toMatchObject({ error: 'error' });
//     });

//     test('Testing return of userProfileV1 when authUserId is trying to access their own information', () => {
//       callingClear();
//       const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
//         'password',
//         'First',
//         'Last').getBody()));

//       const result = JSON.parse(String(callingUserProfile(authUserId.authUserId, authUserId.authUserId).getBody()));
//       expect(result).toMatchObject({
//         user: {
//           uId: authUserId.authUserId,
//           email: 'email@email.com',
//           nameFirst: 'First',
//           nameLast: 'Last',
//           handleStr: 'firstlast'
//         }
//       });
//     });
//   });

describe('Testing users/all/v1', () => {
  test('Testing successful return of users object from users/all/v1', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const uId = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const uId2 = JSON.parse(String(callingAuthRegister(
      'email2@email.com',
      'password2',
      'First2',
      'Last2').getBody()));

    const res = callingUsersAll(authUserId.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toMatchObject({
      users: [{
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast'
      },
      {
        uId: uId.authUserId,
        email: 'email1@email.com',
        nameFirst: 'First1',
        nameLast: 'Last1',
        handleStr: 'first1last1'
      },
      {
        uId: uId2.authUserId,
        email: 'email2@email.com',
        nameFirst: 'First2',
        nameLast: 'Last2',
        handleStr: 'first2last2'
      }
      ]
    });
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    const result = callingUsersAll('');
    expect(result.statusCode).toBe(403); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});

describe('Testing user/profile/setname/v1', () => {
  test('Testing successful return', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserProfileSetName(authUserId.token, 'NewFirstName', 'NewLastName');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    callingUserProfileSetName(authUserId.token, 'NewFirstName', 'NewLastName');
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));

    expect(result).toStrictEqual({});
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'NewFirstName',
        nameLast: 'NewLastName',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error when first name is not valid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserProfileSetName(authUserId.token, '', 'NewLastName');
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });

    const bigFirstName = '510000000000000000000000000000000000000000000000000';
    const res1 = callingUserProfileSetName(authUserId.token, bigFirstName, 'NewLastName');
    expect(res1.statusCode).toBe(400);
    // const result1 = JSON.parse(String(res1.getBody()));
    const edited1 = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result1).toMatchObject({ error: 'error' });
    expect(edited1).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error when last name is not valid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserProfileSetName(authUserId.token, 'NewFirstName', '');
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });

    const bigLastName = '510000000000000000000000000000000000000000000000000';
    const res1 = callingUserProfileSetName(authUserId.token, 'NewFirstName', bigLastName);
    expect(res1.statusCode).toBe(400);
    // const result1 = JSON.parse(String(res1.getBody()));
    const edited1 = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result1).toMatchObject({ error: 'error' });
    expect(edited1).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    const res = callingUserProfileSetName('', 'NewFirst', 'NewLast');
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));
    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});

describe('Testing user/profile/setemail/v1', () => {
  test('Testing successful return', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    // const result = JSON.parse(String(callingUserProfileSetEmail(authUserId.token, 'newemail@email.com').getBody()));
    const res = callingUserProfileSetEmail(authUserId.token, 'newemail@email.com');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toStrictEqual({});
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'newemail@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error when email is not valid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserProfileSetEmail(authUserId.token, 'newemail');
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));

    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error when new email is already in use', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    callingAuthRegister('email1@email.com',
      'password',
      'First1',
      'Last1');

    const res = callingUserProfileSetEmail(authUserId.token, 'email1@email.com');
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));

    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    const res = callingUserProfileSetEmail('!@#$', 'email1@email.com');
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});

describe('Testing user/profile/sethandle/v1', () => {
  test('Testing successful return', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserProfileSetHandle(authUserId.token, 'NewHandle');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toStrictEqual({});
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'NewHandle',
      }
    });
  });

  test('Testing error when handle is < 3 length', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserProfileSetHandle(authUserId.token, '');
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));

    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error when handle is > 20 length', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const bigHandle = '200000000000000000000';
    const res = callingUserProfileSetHandle(authUserId.token, bigHandle);
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));

    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    // expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      user: {
        uId: authUserId.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }
    });
  });

  test('Testing error when handle is already being used', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    callingAuthRegister('email1@email.com',
      'password',
      'First1',
      'Last1');

    const res = callingUserProfileSetHandle(authUserId.token, 'first1last1');
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' });
  });

  test('Testing error when token is invalid', () => {
    callingClear();

    const res = callingUserProfileSetHandle('!@#$', 'NewHandle');
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});
