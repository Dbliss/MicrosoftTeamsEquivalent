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
  // expect(res.statusCode).toBe(OK);
  return res;
}

function callingChannelJoin (token: string, channelId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channel/join/v3`,
        {
          body: JSON.stringify({
            channelId: channelId,
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

describe('HTTP tests for channelDetailsV2', () => {
  test('Testing successful return of channelDetailsV2', () => {
    callingClear();
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'First',
      'Last');

    const registered = JSON.parse(String(auth.getBody()));

    const chanId = callingChannelsCreate(registered.token, 'name', true);
    const channelId = JSON.parse(String(chanId.getBody()));

    const res = callingChannelDetails(registered.token, channelId.channelId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      name: 'name',
      isPublic: true,
      ownerMembers: [{
        uId: registered.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }],
      allMembers: [{
        uId: registered.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }]
    });
  });

  test('successful return of channelDetailsV1 with multiple members', () => {
    callingClear();
    const auth = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const authorised = JSON.parse(String(auth.getBody()));
    const auth1 = callingAuthRegister('email1@email.com',
      'password',
      'First1',
      'Last1');
    const authorised1 = JSON.parse(String(auth1.getBody()));

    const chanId = callingChannelsCreate(authorised.token, 'name', true);
    const channelId = JSON.parse(String(chanId.getBody()));

    callingChannelJoin(authorised1.token, channelId.channelId);

    const res = callingChannelDetails(authorised.token, channelId.channelId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toMatchObject({
      name: 'name',
      isPublic: true,
      ownerMembers: [{
        uId: authorised.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }],
      allMembers: [{
        uId: authorised.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      },
      {
        uId: authorised1.authUserId,
        email: 'email1@email.com',
        nameFirst: 'First1',
        nameLast: 'Last1',
        handleStr: 'first1last1',
      }]
    });
  });

  test('Testing when the channelId is not valid ', () => {
    callingClear();
    const auth = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const authorised = JSON.parse(String(auth.getBody()));
    callingChannelsCreate(authorised.token, 'name', true);

    const res = callingChannelDetails(authorised.token, -9999);
    expect(res.statusCode).toBe(400);
    // const result = JSON.parse(String(res.getBody()));
    // expect(result).toMatchObject({ error: 'error' });
  });

  test('Testing when the token is not valid ', () => {
    callingClear();
    const auth = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const authorised = JSON.parse(String(auth.getBody()));

    const chanId = callingChannelsCreate(authorised.token, 'name', true);
    const channelId = JSON.parse(String(chanId.getBody()));

    const res = callingChannelDetails('random', channelId);
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));
    // expect(result).toMatchObject({ error: 'error' });
  });

  test('channelId is valid but authUserId is not a member of the channel', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const authorised1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email2.com',
      'password2',
      'First2',
      'Last2');
    const authorised2 = JSON.parse(String(auth2.getBody()));

    const chanId = callingChannelsCreate(authorised1.token, 'name', true);
    const channelId = JSON.parse(String(chanId.getBody()));

    const res = callingChannelDetails(authorised2.token, channelId.channelId);
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));
    // expect(result).toMatchObject({ error: 'error' });
  });
});

describe('Testing channelJoinV1', () => {
  test('successfull joining of public channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const person1 = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const person2 = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(person1.token, 'channel1', true);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res4 = callingChannelJoin(person2.token, channel1.channelId);
    expect(res4.statusCode).toBe(OK);
    const bodyObj4 = JSON.parse(res4.body as string);

    expect(bodyObj4).toStrictEqual({});
  });

  test('globalMember tries to join private channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const person1 = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const person2 = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(person1.token, 'channel1', false);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res4 = callingChannelJoin(person2.token, channel1.channelId);
    // const bodyObj4 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(403);

    // expect(bodyObj4).toMatchObject({ error: 'error' });
  });

  test('successfull joining of globalOwner to private channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const globalOwner = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const globalMember = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(globalMember.token, 'channel1', false);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res4 = callingChannelJoin(globalOwner.token, channel1.channelId);
    expect(res4.statusCode).toBe(OK);
    const bodyObj4 = JSON.parse(res4.body as string);

    expect(bodyObj4).toStrictEqual({});
  });

  test('Invalid token with valid channelId', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    // const globalOwner = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const globalMember = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(globalMember.token, 'channel1', false);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res4 = callingChannelJoin('', channel1.channelId);
    // const bodyObj4 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(403);

    // expect(bodyObj4).toStrictEqual({});
  });

  test('Valid token and invalid channelId', () => { // NEED TO DO THIS ~ already done need to double check
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const globalOwner = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const globalMember = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(globalMember.token, 'channel1', false);
    // const channel1 = JSON.parse(res3.body as string);
    expect(res3.statusCode).toBe(OK);

    const res4 = callingChannelJoin(globalOwner.token, 0);
    // const bodyObj4 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(400);

    // expect(bodyObj4).toStrictEqual({});
  });

  test('User is already member of the channel', () => { // NEED TO DO THIS ~ already done need to double check
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    // const globalOwner = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res2.statusCode).toBe(OK);
    const globalMember = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(globalMember.token, 'channel1', false);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res4 = callingChannelJoin(globalMember.token, channel1.channelId);
    // const bodyObj4 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(400);

    // expect(bodyObj4).toStrictEqual({});
  });
});
