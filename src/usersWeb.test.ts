
import request from 'sync-request';
import { callingChannelsCreate } from './channelsServer.test';
import config from './config.json';
import { callingDmCreate } from './dm.test';

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

// POST REQUEST
function callingUserUploadPhoto (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  const res = request(
    'POST',
        `${url}:${port}/user/profile/uploadphoto/v1`,
        {
          body: JSON.stringify({
            imgUrl: imgUrl,
            xStart: xStart,
            yStart: yStart,
            xEnd: xEnd,
            yEnd: yEnd
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  // expect(res.statusCode).toBe(OK);
  return res;
}

import {
  callingClear,
  // callingChannelDetails,
  // callingChannelJoin,
  callingUserProfile, callingUsersAll, callingUserProfileSetEmail, callingUserProfileSetHandle, callingUserProfileSetName, callingAuthRegister, callingMessageSend,
  // callingChannelsCreate
} from './helperFile';

const OK = 200;

describe('Testing userProfileV1', () => {
  test('Testing successful return of user object from userProfileV1', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res8 = callingUserProfile(user1.token, user2.authUserId);
    expect(res8.statusCode).toBe(OK);
    const result = JSON.parse(res8.body as string);

    expect(result).toEqual({
      user: {
        uId: user2.authUserId,
        email: 'email12@gmail.com',
        nameFirst: 'first12',
        nameLast: 'last12',
        handleStr: 'first12last12'
      }
    });
  });

  test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res8 = callingUserProfile(user1.token, -99999);
    expect(res8.statusCode).toBe(400);
  });

  test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res8 = callingUserProfile(user1.token, user1.authUserId);
    expect(res8.statusCode).toBe(OK);
  });

  test('Invalid token test', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res8 = callingUserProfile('-99999', user1.authUserId);
    expect(res8.statusCode).toBe(403);
  });
});

function callingUserStats (token: string) {
  const res = request(
    'GET',
        `${url}:${port}/user/stats/v1`,
        {
          headers: {
            token: token,
          }
        }
  );
  return res;
}

// GET REQUEST
function callingUsersStats (token: string) {
  const res = request(
    'GET',
        `${url}:${port}/users/stats/v1`,
        {
          headers: {
            token: token,
          }
        }
  );
  return res;
}

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
    expect(edited).toEqual({
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
    expect(edited).toEqual({
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
    expect(edited).toEqual({
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

describe('Testing user/stats/v1', () => {
  test('Testing successful return', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const authUserId2 = JSON.parse(String(callingAuthRegister('email3@email.com',
      'password',
      'First2',
      'Last2').getBody()));

    const uIds = [authUserId.authUserId, authUserId2.authUserId];
    const channel = callingChannelsCreate(authUserId.token, 'channelname', true);
    const channelres = JSON.parse(String(channel.getBody()));
    const dmres = callingDmCreate(authUserId.token, uIds);
    expect(dmres.statusCode).toBe(OK);
    const messageres = callingMessageSend(authUserId.token, channelres.channelId, 'random message');
    expect(messageres.statusCode).toBe(OK);

    const res = callingUserStats(authUserId.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      userStats: {
        channelsJoined: [{
          numChannelsJoined: 0,
          timeStamp: expect.any(Number) // time when the account was created
        }, {
          numChannelsJoined: 1,
          timeStamp: expect.any(Number)
        }],
        dmsJoined: [{
          numDmsJoined: 0,
          timeStamp: expect.any(Number)
        }, {
          numDmsJoined: 1,
          timeStamp: expect.any(Number)
        }],
        messagesSent: [{
          numMessagesSent: 0,
          timeStamp: expect.any(Number),
        }, {
          numMessagesSent: 1,
          timeStamp: expect.any(Number),
        }],
        involvementRate: expect.any(Number) // NEED TO DO THIS
      }
    });
  });

  test('Testing error when token is invalid', () => {
    callingClear();

    const res = callingUserStats('!@#$');
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});

describe('users/stats/v1', () => {
  test('Testing successful return', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const authUserId2 = JSON.parse(String(callingAuthRegister('email3@email.com',
      'password',
      'First2',
      'Last2').getBody()));

    const uIds = [authUserId.authUserId, authUserId2.authUserId];
    const channel = callingChannelsCreate(authUserId.token, 'channelname', true);
    const channelres = JSON.parse(String(channel.getBody()));
    const dmres = callingDmCreate(authUserId.token, uIds);
    expect(dmres.statusCode).toBe(OK);
    const messageres = callingMessageSend(authUserId.token, channelres.channelId, 'random message');
    expect(messageres.statusCode).toBe(OK);
    const res = callingUsersStats(authUserId.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      workspaceStats: {
        channelsExist: [{
          numChannelsExist: 0,
          timeStamp: expect.any(Number) // time when the account was created
        }, {
          numChannelsExist: 1,
          timeStamp: expect.any(Number)
        }],
        dmsExist: [{
          numDmsExist: 0,
          timeStamp: expect.any(Number)
        }, {
          numDmsExist: 1,
          timeStamp: expect.any(Number)
        }],
        messagesExist: [{
          numMessagesExist: 0,
          timeStamp: expect.any(Number),
        }, {
          numMessagesExist: 1,
          timeStamp: expect.any(Number),
        }],
        utilizationRate: expect.any(Number) // NEED TO DO THIS
      }
    });
  });

  test('Testing error when token is invalid', () => {
    callingClear();

    const res = callingUserStats('!@#$');
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});

describe('Testing user/profile/uploadphoto/v1', () => {
  // test('Testing successful return', () => {
  //   callingClear();
  //   const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
  //     'password',
  //     'First',
  //     'Last').getBody()));

  //   const result = JSON.parse(String(callingUserUploadPhoto(authUserId.token,'https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2013/08/facebook-silhouette_thumb.jpg', 3, 6, 7, 6).getBody()));
  //   expect(result).toStrictEqual({});

  // });

  test('ImgUrl return error other than 200', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserUploadPhoto(authUserId.token, '', 1, 1, 10, 10);
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));
  });

  test('xStart, yStart, xEnd, yEnd are not within the dimensions', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserUploadPhoto(authUserId.token, 'https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2013/08/facebook-silhouette_thumb.jpg', -1, -1, -10, -10);
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));
  });

  test('xEnd is less than or equal to xStart', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserUploadPhoto(authUserId.token, 'https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2013/08/facebook-silhouette_thumb.jpg', 3, 5, 3, 10);
    expect(res.statusCode).toBe(400);

    const res1 = callingUserUploadPhoto(authUserId.token, 'https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2013/08/facebook-silhouette_thumb.jpg', 3, 5, 0, 10);
    expect(res1.statusCode).toBe(400);
  });
  test('yEnd is less than or equal to yStart', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserUploadPhoto(authUserId.token, 'https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2013/08/facebook-silhouette_thumb.jpg', 3, 6, 7, 6);
    expect(res.statusCode).toBe(400);

    const res1 = callingUserUploadPhoto(authUserId.token, 'https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2013/08/facebook-silhouette_thumb.jpg', 3, 6, 7, 5);
    expect(res1.statusCode).toBe(400);
  });

  test('image uploaded is not a JPG', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserUploadPhoto(authUserId.token, 'invalid url', 3, 6, 7, 6);
    expect(res.statusCode).toBe(400);

    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });

  test('Testing error when token is invalid', () => {
    callingClear();

    const res = callingUserUploadPhoto('#@!$$', 'jpeg', -1, -1, -10, -10); // need to figure out how to put in a valid URL
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));

    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});
