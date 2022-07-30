import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

const post = (path: any, body: any) => {
  const res = request(
    'POST',
        `${url}:${port}/${path}`,
        {
          body: JSON.stringify(body),
          headers: {
            'Content-type': 'application/json'
          },
        }
  );
  let bodyObj: any;
  if (res.statusCode === OK) {
    bodyObj = JSON.parse(res.body as string);
  }
  return bodyObj;
};

function callingClear () {
  const res = request(
    'DELETE',
          `${url}:${port}/clear/V1`
  );
  return res;
}

// wrapper functions

function requestChannelLeave(token: string, channelId: number) {
  return post('channel/leave/v1', { token, channelId });
}

function requestAddOwner(token: string, channelId: number, uId: number) {
  return post('channel/addowner/v1', { token, channelId, uId });
}

function requestRemoveOwner(token:string, channelId: number, uId: number) {
  return post('channel/removeowner/v1', { token, channelId, uId });
}

function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return post('auth/register/v2', { email, password, nameFirst, nameLast });
}

function requestChannelsCreate(token: string, name: string, isPublic: boolean) {
  return post('channels/create/v3', { token, name, isPublic });
}

function requestChannelJoin(token: string, channelId: number) {
  return post('channel/join/v2', { token, channelId });
}

describe('channel/leave/v1', () => {
  test('Success', () => {
    callingClear();
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
    const bodyObj = requestChannelLeave(tokenTest, channelIdTest);
    expect(bodyObj).toMatchObject({});
  });
  test('Invalid token', () => {
    callingClear();
    const bodyObj = requestChannelLeave('', 1);
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('invalid channelId', () => {
    callingClear();
    const bodyObj = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const tokenTest = bodyObj.token;
    const bodyObj1 = requestChannelLeave(tokenTest, -1);
    expect(bodyObj1).toMatchObject({ error: 'error' });
  });
  test('authorised user not a member of the channel', () => {
    callingClear();
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
    const nonMember = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const tokenTest1 = nonMember.token;
    const bodyObj = requestChannelLeave(
      tokenTest1,
      channelIdTest
    );
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
});

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
    const bodyObj = requestAddOwner(tokenTest, channelIdTest, uId);
    expect(bodyObj).toMatchObject({});
  });
  test('invalid token', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('channelId invalid', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('invalid uId', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('uId refers to user who is not a member of the channel', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('uId refers to an owner of the channel', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('channelId is valid, authorised user does not have owner permissions in the channel', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('channel owner can add owner when member', () => {
    callingClear();
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
    callingClear();
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
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('channelId invalid', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('invalid uId', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('uId refers to user who is not an owner of the channel', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('uId refers to the only owner of the channel', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('channelId is valid, authorised user does not have owner permissions in the channel', () => {
    callingClear();
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
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
  test('channel owner can add owner when member', () => {
    callingClear();
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
});
