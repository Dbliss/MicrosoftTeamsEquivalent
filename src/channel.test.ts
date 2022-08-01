import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

function callingClear () {
  const res = request(
    'DELETE',
  `${url}:${port}/clear/V1`);
  return res;
}

function callingChannelsCreate (token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
        `${url}:${port}/channels/create/v3`,
        {
          body: JSON.stringify({
            name: name,
            isPublic: isPublic
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingAuthRegister (email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
        `${url}:${port}/auth/register/v3`,
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
  return res;
}

function callingChannelInvite (token:string, channelId: number, uId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channel/invite/v2`,
        {
          body: JSON.stringify({
            channelId: channelId,
            uId: uId,
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingChannelMessages (token:string, channelId: number, start: number) {
  const res = request(
    'GET',
        `${url}:${port}/channel/messages/v2`,
        {
          qs: {
            token: token,
            channelId: channelId,
            start: start,
          }
        }
  );
  return res;
}

// function callingChannelJoin (token: string, channelId: number) {
//   const res = request(
//     'POST',
//         `${url}:${port}/channel/join/v2`,
//         {
//           body: JSON.stringify({
//             token: token,
//             channelId: channelId,
//           }),
//           headers: {
//             'Content-type': 'application/json',
//           },
//         }
//   );
//   return res;
// }

// describe('Testing channelDetailsV1', () => {
//   test('Testing successful return of channelDetailsV1', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const channelId = channelsCreateV1(authUser.token, 'name', true);
//     const result = channelDetailsV1(authUser.authUserId, channelId.channelId);
//     expect(result).toMatchObject({
//       name: 'name',
//       isPublic: true,
//       ownerMembers: [{
//         uId: authUser.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       }],
//       allMembers: [{
//         uId: authUser.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       }]
//     });
//   });

//   test('successful return of channelDetailsV1 with multiple members', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const authUser1 = authRegisterV1('email1@email.com',
//       'password',
//       'First1',
//       'Last1');

//     const channelId = channelsCreateV1(authUser.token, 'name', true);

//     channelJoinV1(authUser1.authUserId, channelId.channelId);

//     const result = channelDetailsV1(authUser.authUserId, channelId.channelId);
//     expect(result).toMatchObject({
//       name: 'name',
//       isPublic: true,
//       ownerMembers: [{
//         uId: authUser.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       }],
//       allMembers: [{
//         uId: authUser.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       },
//       {
//         uId: authUser1.authUserId,
//         email: 'email1@email.com',
//         nameFirst: 'First1',
//         nameLast: 'Last1',
//         handleStr: 'first1last1',
//       }]
//     });
//   });

//   test('Testing when the channelId is not valid ', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     channelsCreateV1(authUser.token, 'name', true);

//     const result = channelDetailsV1(-9999, -9999);
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('Testing when the channelId is not valid ', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const channelId = -9999;

//     const result = channelDetailsV1(authUser.authUserId, channelId);
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('Testing when the authUserId is not valid ', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const channelId = channelsCreateV1(authUser.token, 'name', true);

//     const userId = -9999;

//     const result = channelDetailsV1(userId, channelId.channelId);
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('channelId is valid but authUserId is not a member of the channel', () => {
//     clearV1();
//     const authUser1 = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const authUser2 = authRegisterV1('email2@email2.com',
//       'password2',
//       'First2',
//       'Last2');

//     const channelId = channelsCreateV1(authUser1.token, 'name', true);

//     const result = channelDetailsV1(authUser2.authUserId, channelId.channelId);
//     expect(result).toMatchObject({ error: 'error' });
//   });
// });

// describe('Testing channelJoinV1', () => {
//   test('Person who created the channel tries to join', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const channelId = channelsCreateV1(authUser.token, 'name', true);

//     const result = channelJoinV1(authUser.authUserId, channelId.channelId);
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('Person who did not create channel tries to join public channel', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const authUser1 = authRegisterV1('email1@email.com',
//       'password1',
//       'First1',
//       'Last1'
//     );

//     /*
//     const expected: usersType = {
//       uId: authUser.authUserId,
//       email: 'email@email.com',
//       nameFirst: 'First',
//       nameLast: 'Last',
//       handleStr: 'firstlast',
//     };

//     const expected1: usersType = {
//       uId: authUser1.authUserId,
//       email: 'email1@email.com',
//       nameFirst: 'First1',
//       nameLast: 'Last1',
//       handleStr: 'first1last1',
//     };
//     */
//     const channelId = channelsCreateV1(authUser1.token, 'name', true);

//     channelDetailsV1(authUser1.authUserId, channelId.channelId);
//     // expect(chDetails['allMembers']).toContainEqual(expected1);
//     // expect(chDetails['allMembers']).not.toContainEqual(expected);

//     const result = channelJoinV1(authUser.authUserId, channelId.channelId);
//     channelDetailsV1(authUser1.authUserId, channelId.channelId);
//     // expect(chDetails1['allMembers']).toContainEqual(expected);
//     expect(result).toMatchObject({});
//   });

//   test('Person who did not create channel tries to join private channel', () => {
//     clearV1();
//     const authUser = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     authRegisterV1('email1@email.com',
//       'password1',
//       'First1',
//       'Last1');

//     const channelId = channelsCreateV1(authUser.token, 'name', false);

//     const result = channelJoinV1(authUser.authUserId, channelId.channelId);
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('Private channel + global owner', () => {
//     clearV1();
//     const globalOwner = authRegisterV1('email@email.com',
//       'password',
//       'First',
//       'Last');

//     const globalMember = authRegisterV1('email1@email.com',
//       'password1',
//       'First1',
//       'Last1');

//     const channelId = channelsCreateV1(globalMember.token, 'name', false);

//     const result = channelJoinV1(globalOwner.authUserId, channelId.channelId);
//     expect(result).toMatchObject({});
//   });
// });

describe('Testing channelInvite1', () => {
  test('channelId does not refer to a valid channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const bodyObj1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const bodyObj2 = JSON.parse(res2.body as string);
    expect(res2.statusCode).toBe(OK);

    const res3 = callingChannelInvite(bodyObj1.token, -31231451, bodyObj2.authUserId);
    const bodyObj3 = JSON.parse(res3.body as string);
    expect(res3.statusCode).toBe(OK);

    expect(bodyObj3).toMatchObject({ error: 'error' });
  });

  test('Uid refers to a user who is already a member of the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const bodyObj1 = JSON.parse(res1.body as string);

    const res2 = callingChannelsCreate(bodyObj1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);

    const res3 = callingChannelInvite(bodyObj1.token, -31231451, bodyObj1.authUserId);
    expect(res3.statusCode).toBe(OK);
    const bodyObj3 = JSON.parse(res3.body as string);

    expect(bodyObj3).toMatchObject({ error: 'error' });
  });

  test('channelId is valid and the token user is not a member of the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const user2 = JSON.parse(res2.body as string);

    const res3 = callingAuthRegister('email3@gmail.com', 'password3', 'first3', 'last3');
    expect(res3.statusCode).toBe(OK);
    const user3 = JSON.parse(res3.body as string);

    const res4 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res4.statusCode).toBe(OK);
    const channel1 = JSON.parse(res4.body as string);

    const res5 = callingChannelInvite(user2.token, channel1.channelId, user3.authUserId);
    expect(res5.statusCode).toBe(OK);
    const bodyObj5 = JSON.parse(res5.body as string);

    expect(bodyObj5).toMatchObject({ error: 'error' });
  });

  test('no errors', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const user2 = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res5 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res5.statusCode).toBe(OK);
    const bodyObj5 = JSON.parse(res5.body as string);

    expect(bodyObj5).toMatchObject({});
  });
});

describe('Testing channelMessages1', () => {
  test('channelId does not refer to a valid channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelMessages(user1.token, -53453252, 0);
    expect(res5.statusCode).toBe(OK);
    const bodyObj5 = JSON.parse(res5.body as string);

    expect(bodyObj5).toMatchObject({ error: 'error' });
  });

  test('start is greater than the total number of messages in the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res3 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res5 = callingChannelMessages(user1.token, channel1.channelId, 99999);
    expect(res5.statusCode).toBe(OK);
    const bodyObj5 = JSON.parse(res5.body as string);

    expect(bodyObj5).toMatchObject({ error: 'error' });
  });

  test('channelId is valid and the authorised user is not a member of the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const user2 = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res5 = callingChannelMessages(user2.token, channel1.channelId, 0);
    expect(res5.statusCode).toBe(OK);
    const bodyObj5 = JSON.parse(res5.body as string);

    expect(bodyObj5).toMatchObject({ error: 'error' });
  });

  test('no errors', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res3 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res5 = callingChannelMessages(user1.token, channel1.channelId, 0);
    expect(res5.statusCode).toBe(OK);
    const bodyObj5 = JSON.parse(res5.body as string);

    expect(bodyObj5).toEqual({ messages: [], start: 0, end: -1 });
  });
});

// describe('Testing channelJoinV1', () => {
//   test('successfull joining of public channel', () => {
//     const res = callingClear();
//     expect(res.statusCode).toBe(OK);

//     const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
//     const person1 = JSON.parse(res1.body as string);
//     expect(res1.statusCode).toBe(OK);

//     const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
//     const person2 = JSON.parse(res2.body as string);
//     expect(res2.statusCode).toBe(OK);

//     const res3 = callingChannelsCreate(person1.token, 'channel1', true);
//     const channel1 = JSON.parse(res3.body as string);
//     expect(res3.statusCode).toBe(OK);

//     const res4 = callingChannelJoin(person2.token, channel1.channelId);
//     const bodyObj4 = JSON.parse(res4.body as string);
//     expect(res4.statusCode).toBe(OK);

//     expect(bodyObj4).toStrictEqual({});
//   });

//   test('globalMember tries to join private channel', () => {
//     const res = callingClear();
//     expect(res.statusCode).toBe(OK);

//     const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
//     const person1 = JSON.parse(res1.body as string);
//     expect(res1.statusCode).toBe(OK);

//     const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
//     const person2 = JSON.parse(res2.body as string);
//     expect(res2.statusCode).toBe(OK);

//     const res3 = callingChannelsCreate(person1.token, 'channel1', false);
//     const channel1 = JSON.parse(res3.body as string);
//     expect(res3.statusCode).toBe(OK);

//     const res4 = callingChannelJoin(person2.token, channel1.channelId);
//     const bodyObj4 = JSON.parse(res4.body as string);
//     expect(res4.statusCode).toBe(403);

//     expect(bodyObj4).toMatchObject({ error: 'error' });
//   });

//   test('successfull joining of globalOwner to private channel', () => {
//     const res = callingClear();
//     expect(res.statusCode).toBe(OK);

//     const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
//     const globalOwner = JSON.parse(res1.body as string);
//     expect(res1.statusCode).toBe(OK);

//     const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
//     const globalMember = JSON.parse(res2.body as string);
//     expect(res2.statusCode).toBe(OK);

//     const res3 = callingChannelsCreate(globalMember.token, 'channel1', false);
//     const channel1 = JSON.parse(res3.body as string);
//     expect(res3.statusCode).toBe(OK);

//     const res4 = callingChannelJoin(globalOwner.token, channel1.channelId);
//     const bodyObj4 = JSON.parse(res4.body as string);
//     expect(res4.statusCode).toBe(OK);

//     expect(bodyObj4).toStrictEqual({});
//   });
// });

export { callingChannelInvite };
