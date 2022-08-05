import { callingClear, requestChannelLeave, requestAddOwner, requestRemoveOwner, requestAuthRegister, requestChannelsCreate, requestChannelInvite } from './helperFile';

const OK = 200;
const BADREQ = 400;
const FORBID = 403;

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
      true
    );
    expect(res.statusCode).toBe(OK);
    const channel = JSON.parse(String(res.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const invite = requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    expect(invite.statusCode).toBe(OK);
    const invited = JSON.parse(String(invite.getBody()));
    expect(invited).toStrictEqual({});
    const leave = requestChannelLeave(member.token, channel.channelId);
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

describe('channel/addowner/v1', () => {
  test('success', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const bodyObj = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(bodyObj.statusCode).toBe(OK);
    const added = JSON.parse(String(bodyObj.getBody()));
    expect(added).toStrictEqual({});
  });

  test('invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const bodyObj = requestAddOwner('', channel.channelId, member.authUserId);
    expect(bodyObj.statusCode).toBe(FORBID);
  });

  test('channelId invalid', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const member = JSON.parse(String(auth1.getBody()));
    requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const bodyObj = requestAddOwner(owner.token, -1, member.authUserId);
    expect(bodyObj.statusCode).toBe(BADREQ);
  });

  test('invalid uId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const bodyObj = requestAddOwner(owner.token, channel.channelId, -1);
    expect(bodyObj.statusCode).toBe(BADREQ);
  });

  test('uId refers to user who is not a member of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const bodyObj = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(bodyObj.statusCode).toBe(BADREQ);
  });

  test('uId refers to an owner of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const bodyObj = requestAddOwner(owner.token, channel.channelId, owner.authUserId);
    expect(bodyObj.statusCode).toBe(BADREQ);
  });

  test('channelId is valid, authorised user does not have owner permissions in the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const member1 = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const member2 = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      member2.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    requestChannelInvite(member2.token, channel.channelId, member1.authUserId);
    const bodyObj = requestAddOwner(member1.token, channel.channelId, member1.authUserId);
    expect(bodyObj.statusCode).toBe(FORBID);
  });
});

describe('channel/removeowner/v1', () => {
  test('success', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const added = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(added.statusCode).toBe(OK);
    const remove = requestRemoveOwner(owner.token, channel.channelId, member.authUserId);
    expect(remove.statusCode).toBe(OK);
    const removed = JSON.parse(String(remove.getBody()));
    expect(removed).toStrictEqual({});
  });

  test('invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const added = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(added.statusCode).toBe(OK);
    const remove = requestRemoveOwner('', channel.channelId, member.authUserId);
    expect(remove.statusCode).toBe(FORBID);
  });

  test('channelId invalid', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const added = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(added.statusCode).toBe(OK);
    const remove = requestRemoveOwner(owner.token, -1, member.authUserId);
    expect(remove.statusCode).toBe(BADREQ);
  });
  test('invalid uId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const added = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(added.statusCode).toBe(OK);
    const remove = requestRemoveOwner(owner.token, channel.channelId, -1);
    expect(remove.statusCode).toBe(BADREQ);
  });

  test('uId refers to user who is not an owner of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const member = JSON.parse(String(auth1.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const bodyObj = requestRemoveOwner(
      owner.token,
      channel.channelId,
      member.authUserId
    );
    expect(bodyObj.statusCode).toBe(BADREQ);
  });

  test('uId refers to the only owner of the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const remove = requestRemoveOwner(
      owner.token,
      channel.channelId,
      owner.authUserId
    );
    expect(remove.statusCode).toBe(BADREQ);
  });

  test('channelId is valid, authorised user does not have owner permissions in the channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = requestAuthRegister(
      'email@email.com',
      'password123',
      'first',
      'last'
    );
    const owner = JSON.parse(String(auth.getBody()));
    const create = requestChannelsCreate(
      owner.token,
      'name',
      true
    );
    const channel = JSON.parse(String(create.getBody()));
    const auth1 = requestAuthRegister(
      'email1@email.com',
      'password123',
      'first1',
      'last1'
    );
    const member = JSON.parse(String(auth1.getBody()));
    requestChannelInvite(owner.token, channel.channelId, member.authUserId);
    const add = requestAddOwner(owner.token, channel.channelId, member.authUserId);
    expect(add.statusCode).toBe(OK);
    const remove = requestRemoveOwner(
      member.token,
      channel.channelId,
      member.authUserId
    );
    expect(remove.statusCode).toBe(FORBID);
  });
});
