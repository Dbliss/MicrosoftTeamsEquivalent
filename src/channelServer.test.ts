import { token } from 'morgan';
import request from 'sync-request';
import config from './config.json';

const OK = 200;
const BADREQ = 400;
const FORBID = 403;
const port = config.port;
const url = config.url;


function callingClear () {
  const res = request(
    'DELETE',
          `${url}:${port}/clear/V1`
  );
  return res;
}

// wrapper functions

function requestChannelLeave(token: string, channelId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channel/leave/v3`,
        {
          body: JSON.stringify({
            channelId: channelId
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function requestAddOwner(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channels/addowner/v2`,
        {
          body: JSON.stringify({
            channelId: channelId,
            uId: uId
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function requestRemoveOwner(token:string, channelId: number, uId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channels/removeowner/v2`,
        {
          body: JSON.stringify({
            channelId: channelId,
            uId: uId
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
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

function requestChannelsCreate(token: string, name: string, isPublic: boolean) {
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

function requestChannelJoin(token: string, channelId: number) {
  const res = request(
    'POST',
        `${url}:${port}/channels/join/v3`,
        {
          body: JSON.stringify({
            channelId: channelId
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

describe('channel/leave/v1', () => {
  test('Success', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const res = requestChannelsCreate(
      owner.token,
      'name',
      false
    );
    expect(res.statusCode).toBe(OK);
    const channel = JSON.parse(String(res.getBody()));
    const leave = requestChannelLeave(owner.token, channel.channelId);
    expect(leave.statusCode).toBe(OK);
    const bodyObj = JSON.parse(String(leave.getBody()));
    expect(bodyObj).toMatchObject({});
  });

  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const res = requestChannelLeave('', 1);
    expect(res.statusCode).toBe(FORBID);
  });

  test('invalid channelId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const res = requestChannelsCreate(
      owner.token,
      'name',
      false
    );
    expect(res.statusCode).toBe(OK);
    const channel = JSON.parse(String(res.getBody()));
    const bodyObj1 = requestChannelLeave(owner.token, 1);
    expect(bodyObj1.statusCode).toBe(BADREQ);
  });

  test('authorised user not a member of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const channelId = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    expect(channelId.statusCode).toBe(OK);
    const channel = JSON.parse(String(channelId.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const res = requestChannelLeave(
      member.token,
      channel.channelId
    );
    expect(res.statusCode).toBe(FORBID);
  });
});
/*
describe('channel/addowner/v1', () => {
  test('success', () => {
    const user = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = user.token;
    const uId = user.authUserId;
    const owner = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest1,
      'name',
      false
    );
    requestChannelJoin(tokenTest, channelIdTest);
    const bodyObj = requestAddOwner(tokenTest, channelIdTest, uId);
    expect(bodyObj).toMatchObject({});
  });
  test('invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const user = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const uId = user.authUserId;
    const owner = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const bodyObj = requestAddOwner('', channelIdTest, uId);
    expect(bodyObj).toBe(FORBID);
  });
  test('channelId invalid', () => {
    expect(callingClear().statusCode).toBe(OK);
    const user = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = user.token;
    const authUserId = user.authUserId;
    const bodyObj = requestAddOwner(
      tokenTest,
      -1,
      authUserId
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('invalid uId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const bodyObj = requestAddOwner(
      tokenTest,
      channelIdTest,
      -1
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('uId refers to user who is not a member of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const user = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const userId = user.authUserId;
    const tokenTest1 = user.token;
    const bodyObj = requestAddOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('uId refers to an owner of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const userId = owner.authUserId;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const bodyObj = requestAddOwner(
      tokenTest,
      channelIdTest,
      userId
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('channelId is valid, authorised user does not have owner permissions in the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const user = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = user.token;
    const userId = user.authUserId;
    const bodyObj = requestAddOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    expect(bodyObj).toBe(FORBID);
  });
  test('channel owner can add owner when member', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const member = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = member.token;
    const userId = member.authUserId;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    requestChannelJoin(
      tokenTest1,
      channelIdTest
    );
    const bodyObj = requestAddOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    expect(bodyObj).toMatchObject({});
  });
});

describe('channel/removeowner/v1', () => {
  test('success', () => {
    expect(callingClear().statusCode).toBe(OK);
    const user = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = user.token;
    const userId = user.authUserId;
    const owner = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = owner.token;
    const userId1 = owner.authUserId;
    const channelIdTest = requestChannelsCreate(
      tokenTest1,
      'name',
      false
    );
    requestChannelJoin(tokenTest, channelIdTest);
    requestAddOwner(
      tokenTest,
      channelIdTest,
      userId
    );
    const bodyObj = requestRemoveOwner(
      tokenTest1,
      -1,
      userId1
    );
    expect(bodyObj).toMatchObject({});
  });
  test('invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const user = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const uId = user.authUserId;
    const owner = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const bodyObj = requestRemoveOwner('', channelIdTest, uId);
    expect(bodyObj).toBe(FORBID);
  });
  test('channelId invalid', () => {
    expect(callingClear().statusCode).toBe(OK);
    const user = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = user.token;
    const authUserId = user.authUserId;
    const bodyObj = requestRemoveOwner(
      tokenTest,
      -1,
      authUserId
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('invalid uId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const bodyObj = requestRemoveOwner(
      tokenTest,
      channelIdTest,
      -1
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('uId refers to user who is not an owner of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const user = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const userId = user.authUserId;
    const tokenTest1 = user.token;
    const bodyObj = requestRemoveOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('uId refers to the only owner of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const userId = owner.authUserId;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const bodyObj = requestRemoveOwner(
      tokenTest,
      channelIdTest,
      userId
    );
    expect(bodyObj).toBe(BADREQ);
  });
  test('channelId is valid, authorised user does not have owner permissions in the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    const user = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = user.token;
    const userId = user.authUserId;
    const bodyObj = requestRemoveOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    expect(bodyObj).toBe(FORBID);
  });
  test('channel owner can add owner when member', () => {
    expect(callingClear().statusCode).toBe(OK);
    const owner = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = owner.token;
    const member = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = member.token;
    const userId = member.authUserId;
    const channelIdTest = requestChannelsCreate(
      tokenTest,
      'name',
      false
    );
    requestChannelJoin(
      tokenTest1,
      channelIdTest
    );
    requestAddOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    const bodyObj = requestRemoveOwner(
      tokenTest1,
      channelIdTest,
      userId
    );
    expect(bodyObj).toMatchObject({});
  });
}); */
