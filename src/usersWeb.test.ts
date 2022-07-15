import request from 'sync-request';
import config from './config.json';
const OK = 200;
const port = config.port;
const url = config.url;

// function callingChannelDetails (token: string, channelId: number) {
//     const res = request(
//         'GET',
//         `${url}:${port}/channel/details/v2`,
//         {
//             qs: {
//                 token: token,
//                 channelId: channelId,
//             }
//         }
//     );
//     return res;
// }

// function callingChannelJoin (token: string, channelId: number) {
//     const res = request(
//         'POST',
//         `${url}:${port}/channel/details/v2`,
//         {
//             body: JSON.stringify({
//                 token: token,
//                 channelId: channelId,
//             }),
//             headers: {
//                 'Content-type': 'application/json',
//             },
//         }
//     );
//     return res;
// }

function callingClear () {
  const res = request(
    'DELETE',
        `${url}:${port}/clear/v1`
  );
    // expect(res.statusCode).toBe(OK);
}

function callingUserProfile (token: string, uId: number) {
  const res = request(
    'GET',
        `${url}:${port}/user/profile/v2`,
        {
          qs: {
            token: token,
            uId: uId,
          }
        }
  );
    // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUsersAll (token: string) {
  const res = request(
    'GET',
        `${url}:${port}/users/all/v1`,
        {
          qs: {
            token: token,
          }
        }
  );
    // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserProfileSetName (token: string, nameFirst:string, nameLast:string) {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/setname/v1`,
        {
          body: JSON.stringify({
            token: token,
            nameFirst: nameFirst,
            nameLast: nameLast,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserProfileSetEmail (token: string, email: string) {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/setemail/v1`,
        {
          body: JSON.stringify({
            token: token,
            email: email,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
    // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserProfileSetHandle (token: string, handleStr: string) {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/sethandle/v1`,
        {
          body: JSON.stringify({
            token: token,
            handleStr: handleStr,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  expect(res.statusCode).toBe(OK);
  return res;
}

function callingAuthRegister (email:string, password:string, nameFirst:string, nameLast:string) {
  const res = request(
    'POST',
        `${url}:${port}/auth/register/v2`,
        {
          body: JSON.stringify({
            email: email,
            password: password,
            nameFirst: nameFirst,
            nameLast: nameLast
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  expect(res.statusCode).toBe(OK);
  return res;
}

// function callingChannelsCreate (token: string, name: string, isPublic: boolean) {
//     const res = request(
//         'POST',
//         `${url}:${port}/channel/details/v2`,
//         {
//             body: JSON.stringify({
//                 token: token,
//                 name: name,
//                 isPublic: isPublic,
//             }),
//             headers: {
//                 'Content-type': 'application/json',
//             },
//         }
//     );
//     return res;
// }

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

    const result = JSON.parse(String(callingUsersAll(authUserId.token).getBody()));
    //   console.log(result);
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
    const result = JSON.parse(String(callingUsersAll('').getBody()));
    expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
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

    const result = callingUserProfileSetName(authUserId.token, 'NewFirstName', 'NewLastName');
    callingUserProfileSetName(authUserId.token, 'NewFirstName', 'NewLastName');
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    console.log(edited);
    expect(result).toMatchObject({});
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'NewFirstName',
      nameLast: 'NewLastName',
      handleStr: 'firstlast',
    });
  });

  test('Testing error when first name is not valid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const result = JSON.parse(String(callingUserProfileSetName(authUserId.token, '', 'NewLastName').getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });

    const bigFirstName = '510000000000000000000000000000000000000000000000000';
    const result1 = JSON.parse(String(callingUserProfileSetName(authUserId.token, bigFirstName, 'NewLastName').getBody()));
    const edited1 = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result1).toMatchObject({ error: 'error' });
    expect(edited1).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error when last name is not valid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const result = JSON.parse(String(callingUserProfileSetName(authUserId.token, 'NewFirstName', '').getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });

    const bigLastName = '510000000000000000000000000000000000000000000000000';
    const result1 = JSON.parse(String(callingUserProfileSetName(authUserId.token, 'NewFirstName', bigLastName).getBody()));
    const edited1 = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result1).toMatchObject({ error: 'error' });
    expect(edited1).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    const result = JSON.parse(String(callingUserProfileSetName('', 'NewFirst', 'NewLast').getBody()));
    expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
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
    const result = callingUserProfileSetEmail(authUserId.token, 'newemail@email.com');
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({});
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'newemail@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error when email is not valid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const result = JSON.parse(String(callingUserProfileSetEmail(authUserId.token, 'newemail').getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error when new email is already in use', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const authUserId1 = JSON.parse(String(callingAuthRegister('email1@email.com',
      'password',
      'First1',
      'Last1').getBody()));

    const result = JSON.parse(String(callingUserProfileSetEmail(authUserId.token, 'email1@email.com').getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const result = JSON.parse(String(callingUserProfileSetEmail('!@#$', 'email1@email.com').getBody()));
    expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
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
    console.log(String(callingUserProfileSetHandle(authUserId.token, 'NewHandle').getBody()));
    const result = callingUserProfileSetHandle(authUserId.token, 'NewHandle');
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({});
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'NewHandle',
    });
  });

  test('Testing error when handle is < 3 length', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const result = JSON.parse(String(callingUserProfileSetHandle(authUserId.token, '').getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error when handle is > 20 length', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const bigHandle = '200000000000000000000';
    const result = JSON.parse(String(callingUserProfileSetHandle(authUserId.token, bigHandle).getBody()));
    const edited = JSON.parse(String(callingUserProfile(authUserId.token, authUserId.authUserId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
    expect(edited).toMatchObject({
      uId: authUserId.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    });
  });

  test('Testing error when handle is already being used', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const authUserId1 = JSON.parse(String(callingAuthRegister('email1@email.com',
      'password',
      'First1',
      'Last1').getBody()));

    const result = JSON.parse(String(callingUserProfileSetHandle(authUserId.token, 'first1last1').getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Testing error when token is invalid', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const result = JSON.parse(String(callingUserProfileSetHandle('!@#$', 'NewHandle').getBody()));
    expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});
