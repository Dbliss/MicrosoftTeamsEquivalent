import { callingClear, callingChannelsCreate, callingChannelslist, callingChannelslistAll, callingAuthRegister } from './helperFile';

const OK = 200;

describe('Testing channelsCreateV1', () => {
  test('Name length < 1', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'First',
      'Last'
    );
    expect(auth.statusCode).toBe(OK);
    const registered = JSON.parse(String(auth.getBody()));

    const res = callingChannelsCreate(registered.token, '', false);
    expect(res.statusCode).toBe(400);
  });

  test('Name length > 20', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'First',
      'Last'
    );
    expect(auth.statusCode).toBe(OK);
    const registered = JSON.parse(String(auth.getBody()));

    const res = callingChannelsCreate(
      registered.token,
      'abcdefghijklmnopqrstuv',
      false
    );
    expect(res.statusCode).toBe(400);
  });

  test('Valid parameters', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'First',
      'Last');
    expect(auth.statusCode).toBe(OK);
    const registered = JSON.parse(String(auth.getBody()));

    const res = callingChannelsCreate(
      registered.token,
      'name',
      false);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ channelId: expect.any(Number) });
  });

  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);

    expect(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').statusCode).toBe(OK);
    const res = callingChannelsCreate(
      '-9999',
      'name',
      false);
    expect(res.statusCode).toBe(403);
  });
});

describe('Testing channelsListV1', () => {
  test('Listing 2 channels user is part of', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(auth.statusCode).toBe(OK);
    const registered = JSON.parse(String(auth.getBody()));

    const channelId1 = callingChannelsCreate(registered.token,
      'name1',
      false);
    expect(channelId1.statusCode).toBe(OK);
    const channel1 = JSON.parse(String(channelId1.getBody()));

    const channelId2 = callingChannelsCreate(registered.token,
      'name2',
      true);
    expect(channelId2.statusCode).toBe(OK);
    const channel2 = JSON.parse(String(channelId2.getBody()));

    const result = callingChannelslist(registered.token);
    expect(result.statusCode).toBe(OK);
    const result1 = JSON.parse(String(result.getBody()));
    expect(result1).toMatchObject({
      channels: [{
        channelId: channel1.channelId,
        name: 'name1'
      },
      {
        channelId: channel2.channelId,
        name: 'name2'
      }]
    });
  });

  test('Listing 1 channel user is part of', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    expect(auth2.statusCode).toBe(OK);
    const registered2 = JSON.parse(String(auth2.getBody()));

    expect(callingChannelsCreate(registered1.token,
      'name1',
      false).statusCode).toBe(OK);

    const channelId = callingChannelsCreate(registered2.token,
      'name2',
      true);
    expect(channelId.statusCode).toBe(OK);
    const channel = JSON.parse(String(channelId.getBody()));

    const result = callingChannelslist(registered2.token);
    expect(result.statusCode).toBe(OK);
    const result1 = JSON.parse(String(result.getBody()));
    expect(result1).toMatchObject({
      channels: [{
        channelId: channel.channelId,
        name: 'name2'
      }]
    });
  });

  test('Listing 0 channels user is not part of any', () => {
    expect(callingClear().statusCode).toBe(OK);
    const authUserId1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(authUserId1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(authUserId1.getBody()));

    const authUserId2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    expect(authUserId2.statusCode).toBe(OK);
    const registered2 = JSON.parse(String(authUserId2.getBody()));

    expect(callingChannelsCreate(registered1.token,
      'name1',
      false).statusCode).toBe(OK);

    expect(callingChannelsCreate(registered1.token,
      'name2',
      true).statusCode).toBe(OK);

    const result = callingChannelslist(registered2.token);
    expect(result.statusCode).toBe(OK);
    const result1 = JSON.parse(String(result.getBody()));
    expect(result1).toMatchObject({ channels: [] });
  });

  test('authUserId Invalid', () => {
    expect(callingClear().statusCode).toBe(OK);
    const authUserId1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(authUserId1.statusCode).toBe(OK);
    const registered = JSON.parse(String(authUserId1.getBody()));
    expect(callingChannelsCreate(registered.token,
      'name1',
      false).statusCode).toBe(OK);

    const result = callingChannelslist('-99999');
    expect(result.statusCode).toBe(403);
  });
});

describe('Testing channelsListV1', () => {
  test('Listing 2 channels created by user', () => {
    expect(callingClear().statusCode).toBe(OK);
    const authUserId = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(authUserId.statusCode).toBe(OK);
    const registered = JSON.parse(String(authUserId.getBody()));

    const channelId1 = callingChannelsCreate(registered.token,
      'name1',
      false);
    expect(channelId1.statusCode).toBe(OK);
    const channel1 = JSON.parse(String(channelId1.getBody()));

    const channelId2 = callingChannelsCreate(registered.token,
      'name2',
      true);
    expect(channelId2.statusCode).toBe(OK);
    const channel2 = JSON.parse(String(channelId2.getBody()));

    const channels = callingChannelslistAll(registered.token);
    expect(channels.statusCode).toBe(OK);
    const result = JSON.parse(String(channels.getBody()));
    expect(result).toMatchObject({
      channels: [{
        channelId: channel1.channelId,
        name: 'name1'
      },
      {
        channelId: channel2.channelId,
        name: 'name2'
      }]
    });
  });

  test('Listing 2 channels user created 1', () => {
    expect(callingClear().statusCode).toBe(OK);
    const authUserId1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(authUserId1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(authUserId1.getBody()));

    const authUserId2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    expect(authUserId2.statusCode).toBe(OK);
    const registered2 = JSON.parse(String(authUserId2.getBody()));

    const channelId1 = callingChannelsCreate(registered1.token,
      'name1',
      false);
    expect(channelId1.statusCode).toBe(OK);
    const channel1 = JSON.parse(String(channelId1.getBody()));

    const channelId2 = callingChannelsCreate(registered2.token,
      'name2',
      true);
    expect(channelId1.statusCode).toBe(OK);
    const channel2 = JSON.parse(String(channelId2.getBody()));

    const result = callingChannelslistAll(registered2.token);
    expect(result.statusCode).toBe(OK);
    const result1 = JSON.parse(String(result.getBody()));
    expect(result1).toMatchObject({
      channels: [{
        channelId: channel1.channelId,
        name: 'name1'
      },
      {
        channelId: channel2.channelId,
        name: 'name2'
      }]
    });
  });

  test('Listing 2 channels user created 0', () => {
    expect(callingClear().statusCode).toBe(OK);
    const authUserId1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(authUserId1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(authUserId1.getBody()));

    const authUserId2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    expect(authUserId2.statusCode).toBe(OK);
    const registered2 = JSON.parse(String(authUserId2.getBody()));

    const channelId1 = callingChannelsCreate(registered1.token,
      'name1',
      false);
    expect(channelId1.statusCode).toBe(OK);
    const channel1 = JSON.parse(String(channelId1.getBody()));

    const channelId2 = callingChannelsCreate(registered1.token,
      'name2',
      true);
    expect(channelId2.statusCode).toBe(OK);
    const channel2 = JSON.parse(String(channelId2.getBody()));

    const result = callingChannelslistAll(registered2.token);
    expect(result.statusCode).toBe(OK);
    const result1 = JSON.parse(String(result.getBody()));
    expect(result1).toMatchObject({
      channels: [{
        channelId: channel1.channelId,
        name: 'name1'
      },
      {
        channelId: channel2.channelId,
        name: 'name2'
      }]
    });
  });

  test('authUserId Invalid', () => {
    expect(callingClear().statusCode).toBe(OK);
    const authUserId1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(authUserId1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(authUserId1.getBody()));

    callingChannelsCreate(registered1.token,
      'name1',
      false);

    const result = callingChannelslistAll('-99999');
    expect(result.statusCode).toBe(403);
  });
});
