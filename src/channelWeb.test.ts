import request from 'sync-request';
// importing other essential functions used in channel

import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

function callingChannelDetails (token: string, channelId: number) {
  const res = request(
    'GET',
        `${url}:${port}/channel/details/v2`,
        {
          qs: {
            token: token,
            channelId: channelId,
          }
        }
  );
  expect(res.statusCode).toBe(OK);
  return res;
}

function callingChannelJoin (token: string, channelId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channel/join/v2`,
        {
          body: JSON.stringify({
            token: token,
            channelId: channelId,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  expect(res.statusCode).toBe(OK);
  return res;
}

function callingClear () {
  const res = request(
    'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {

          }
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

function callingChannelsCreate (token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
        `${url}:${port}/channels/create/v3`,
        {
          body: JSON.stringify({
            name: name,
            isPublic: isPublic,
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

// describe('HTTP tests for channelDetailsV2', () => {
//   test('Testing successful return of channelDetailsV2', () => {
//     callingClear();
//     const auth = callingAuthRegister(
//       'email@email.com',
//       'password',
//       'First',
//       'Last');

//     const registered = JSON.parse(String(auth.getBody()));

//     const chanId = callingChannelsCreate(registered.token, 'name', true);
//     const channelId = JSON.parse(String(chanId.getBody()));

//     const res = callingChannelDetails(registered.token, channelId.channelId);
//     const result = JSON.parse(String(res.getBody()));

//     expect(result).toMatchObject({
//       name: 'name',
//       isPublic: true,
//       ownerMembers: [{
//         uId: registered.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       }],
//       allMembers: [{
//         uId: registered.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       }]
//     });
//   });

//   test('successful return of channelDetailsV1 with multiple members', () => {
//     callingClear();
//     const auth = callingAuthRegister('email@email.com',
//       'password',
//       'First',
//       'Last');
//     const authorised = JSON.parse(String(auth.getBody()));
//     const auth1 = callingAuthRegister('email1@email.com',
//       'password',
//       'First1',
//       'Last1');
//     const authorised1 = JSON.parse(String(auth1.getBody()));

//     const chanId = callingChannelsCreate(authorised.token, 'name', true);
//     const channelId = JSON.parse(String(chanId.getBody()));

//     callingChannelJoin(authorised1.token, channelId.channelId);

//     const res = callingChannelDetails(authorised.token, channelId.channelId);
//     const result = JSON.parse(String(res.getBody()));

//     expect(result).toMatchObject({
//       name: 'name',
//       isPublic: true,
//       ownerMembers: [{
//         uId: authorised.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       }],
//       allMembers: [{
//         uId: authorised.authUserId,
//         email: 'email@email.com',
//         nameFirst: 'First',
//         nameLast: 'Last',
//         handleStr: 'firstlast',
//       },
//       {
//         uId: authorised1.authUserId,
//         email: 'email1@email.com',
//         nameFirst: 'First1',
//         nameLast: 'Last1',
//         handleStr: 'first1last1',
//       }]
//     });
//   });

//   test('Testing when the channelId is not valid ', () => {
//     callingClear();
//     const auth = callingAuthRegister('email@email.com',
//       'password',
//       'First',
//       'Last');
//     const authorised = JSON.parse(String(auth.getBody()));
//     callingChannelsCreate(authorised.token, 'name', true);

//     const res = callingChannelDetails(authorised.token, -9999);
//     const result = JSON.parse(String(res.getBody()));
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('Testing when the token is not valid ', () => {
//     callingClear();
//     const auth = callingAuthRegister('email@email.com',
//       'password',
//       'First',
//       'Last');
//     const authorised = JSON.parse(String(auth.getBody()));

//     const chanId = callingChannelsCreate(authorised.token, 'name', true);
//     const channelId = JSON.parse(String(chanId.getBody()));

//     const res = callingChannelDetails('random', channelId);
//     const result = JSON.parse(String(res.getBody()));
//     expect(result).toMatchObject({ error: 'error' });
//   });

//   test('channelId is valid but authUserId is not a member of the channel', () => {
//     callingClear();
//     const auth1 = callingAuthRegister('email@email.com',
//       'password',
//       'First',
//       'Last');
//     const authorised1 = JSON.parse(String(auth1.getBody()));

//     const auth2 = callingAuthRegister('email2@email2.com',
//       'password2',
//       'First2',
//       'Last2');
//     const authorised2 = JSON.parse(String(auth2.getBody()));

//     const chanId = callingChannelsCreate(authorised1.token, 'name', true);
//     const channelId = JSON.parse(String(chanId.getBody()));

//     const res = callingChannelDetails(authorised2.token, channelId.channelId);
//     const result = JSON.parse(String(res.getBody()));
//     expect(result).toMatchObject({ error: 'error' });
//   });
// });

describe('Testing channelJoinV1', () => {
  test('Person who created the channel tries to join', () => {
    callingClear();

    const auth = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const authUser = JSON.parse(String(auth.getBody()));

    const channelId = JSON.parse(String((callingChannelsCreate(authUser.token, 'name', true)).getBody()));

    const result = JSON.parse(String((callingChannelJoin(authUser.token, channelId.channelId)).getBody()));

    expect(result).toMatchObject({ error: 'error' });
  });

  // check the below test to see if working
  test('Person who did not create channel tries to join public channel', () => {
    callingClear();
    const authUser = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const authUser1 = JSON.parse(String(callingAuthRegister('email1@email.com',
      'password1',
      'First1',
      'Last1'
    ).getBody()));

    const expected = {
      uId: authUser.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    };

    const expected1 = {
      uId: authUser1.authUserId,
      email: 'email1@email.com',
      nameFirst: 'First1',
      nameLast: 'Last1',
      handleStr: 'first1last1',
    };

    const channelId = JSON.parse(String(callingChannelsCreate(authUser1.token, 'name', true).getBody()));

    const chDetails = JSON.parse(String(callingChannelDetails(authUser1.token, channelId.channelId).getBody()));
    expect(chDetails.allMembers).toContainEqual(expected1);
    expect(chDetails.allMembers).not.toContainEqual(expected);

    const result = JSON.parse(String(callingChannelJoin(authUser.token, channelId.channelId).getBody()));
    expect(result).toMatchObject({});

    const chDetails1 = JSON.parse(String(callingChannelDetails(authUser1.token, channelId.channelId).getBody()));
    expect(chDetails1.allMembers).toContainEqual(expected);
  });

  test('Person who did not create channel tries to join private channel', () => {
    callingClear();
    const authUser = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const authUser1 = JSON.parse(String(callingAuthRegister('email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const channelId = JSON.parse(String(callingChannelsCreate(authUser.token, 'name', false).getBody()));

    const result = JSON.parse(String(callingChannelJoin(authUser1.token, channelId.channelId).getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Private channel + global owner', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalMember = JSON.parse(String(callingAuthRegister('email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));
    console.log(globalMember.token);
    const channelId = JSON.parse(String(callingChannelsCreate(globalMember.token, 'name', false).getBody()));

    const result = JSON.parse(String(callingChannelJoin(globalOwner.token, channelId.channelId).getBody()));
    expect(result).toMatchObject({});
  });
});
