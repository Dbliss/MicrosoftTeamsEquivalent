import { callingDmCreate, callingMessageSendDm, callingDmMessages, callingClear, callingChannelsCreate, callingAuthRegister, callingMessageSend, callingChannelInvite, callingMessageShare, callingChannelMessages, callingMessagePin, callingMessageUnpin, callingMessageSendLaterDm, callingMessageSendLater } from './helperFile';

const OK = 200;

describe('Testing message Share', () => {
  test('Invalid token', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare('88888', message1.messageId, 'yes sir', channel1.channelId, -1);
    expect(res4.statusCode).toBe(400);
  });

  test('both channelId and dmId are invalid', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user1.token, message1.messageId, 'yes sir', -99999, -99999);
    expect(res4.statusCode).toBe(400);
  });

  test('neither channelId nor dmId are -1', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('emai2l1@gmail.com', 'passw2ord1', 'fi2rst1', 'last21');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user1.token, message1.messageId, 'yes sir', channel1.channelId, dm1.dmId);
    expect(res4.statusCode).toBe(400);
  });

  test('ogMessageId does not refer to a valid message within a channel that the authorised user has joined', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email21@gmail.com', 'password21', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user2.token, message1.messageId, 'yes sir', channel1.channelId, -1);
    expect(res4.statusCode).toBe(400);
  });

  test('ogMessageId does not refer to a valid message within a DM that the authorised user has joined', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res2 = callingAuthRegister('email13@gmail.com', 'password13', 'first13', 'last13');
    expect(res2.statusCode).toBe(OK);
    const user3 = JSON.parse(res2.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user3.token, message1.messageId, 'yes sir', -1, dm1.dmId);
    expect(res4.statusCode).toBe(400);
  });

  test('length of message is more than 1000 characters', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user1.token, message1.messageId, 'fYRmn9kgSrspFovoTviSSpJbq81ZtT92UqUWR4nX7yizYs5iPp2Pr4StO2GFdOHMRKIHgtrKnEqsXASLtIcIQRx03dAsuo20FAOKlHN5aGoIFGhjGwsGtzk98ebMpiA4oVu8cHZuupmshmOiMQ3195nhfgPSeAun5QzoJ8WjAS2GThPD0eYhqyx8il7bMlqBTfkcXyUjkbxj6CYk2hQpz2cPle2klS44MhhpBEThGVKUGffY0mA9Guq1mrX5sjNUkJBEoagJs9sEa43DxEakiPPGkd8Vmjd4fwVqiH9txcdCZBdw4EcnbNXxlwYcBLXRb2FuLzvTv4fk4hNuhEpDk9XHRMLtkjsVv7OF8AljUlJxhjc9vrPLaQqMn2W5wZhOisPLC3fLjRsmEjx2G5ewcZocOqvYCBfAejFbaukis9iqTI8YoOBlit4yKRs9hSxRR70fKpHGy9wEFg5ksZHNDIelETs0Oetoe8y37XRKvjGCI9SHaP6cTPdKrdafBBWiTCSljfz8K5bYZvTuxkSIoikeDsGq0TRlO2Fenzi2qpMpS0FCz9qstNyBdvyvDw1Ie8wcL93CKLtiHxz4ybgqDtg4Ot4QQ6Dk0R48uyB6DqVu7UhGSLdLibcdbew67xUmsQaMz7IadIUJL8GpGk05BaU0j3qROSvwSr43ChY0iWfEeQwup5gpIE2C4NUoyZS2qXw3cOAARmsjZClQmfAONhNBVByRQmjiw8MmT5HeR9Oe9H9ttmJNU5b3nz5nEVBjm0CdXdY3ATZIK8pu5wdFSjlYRFVT0QARirLiKVEJS48rz4lco2SbidlAyBf0XVk4EvQuPxorWTWrTwGdtGLsV0GPZZEZahVVA9gT8kku42vkWP99ToREJiAS7OXB1NeArsL24EjMvh8Byk3b1b5ylUenKJiPYnLMMkQR3wDrNdCT7pLuDPdTiKkfLTDq2nMkjIp1fCKti28rWfgOm13WlBvhAPoQO0LLWosjMlkyJ', -1, dm1.dmId);
    expect(res4.statusCode).toBe(400);
  });

  test('the pair of channelId and dmId are valid (i.e. one is -1, the other is valid) and the authorised user has not joined the channel or DM they are trying to share the message to', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res2 = callingAuthRegister('email13@gmail.com', 'password13', 'first13', 'last13');
    expect(res2.statusCode).toBe(OK);
    const user3 = JSON.parse(res2.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res6 = callingChannelsCreate(user3.token, 'channel1', true);
    expect(res6.statusCode).toBe(OK);
    const channel1 = JSON.parse(res6.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user2.token, message1.messageId, 'yes sir', channel1.channelId, -1);
    expect(res4.statusCode).toBe(403);
  });

  test('succesful message share to a dm from a channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res6 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res6.statusCode).toBe(OK);
    const channel1 = JSON.parse(res6.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user1.token, message1.messageId, 'yes sir', -1, dm1.dmId);
    expect(res4.statusCode).toBe(OK);
    const result = JSON.parse(String(res4.getBody()));

    expect(result).toMatchObject({ sharedMessageId: expect.any(Number) });

    const res8 = callingDmMessages(user1.token, dm1.dmId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq//yes sir', messageId: result.sharedMessageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('Success sharing a message to a channel from a channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user2.token, message1.messageId, 'yes sir', -1, dm1.dmId);
    expect(res4.statusCode).toBe(OK);
    const result = JSON.parse(res4.body as string);

    const res8 = callingDmMessages(user1.token, dm1.dmId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq//yes sir', messageId: result.sharedMessageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }, { message: 'heaqaewqeuhq', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('succesful message share to a channel from a dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res6 = callingChannelsCreate(user2.token, 'channel1', true);
    expect(res6.statusCode).toBe(OK);
    const channel1 = JSON.parse(res6.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user2.token, message1.messageId, 'yes sir', channel1.channelId, -1);
    expect(res4.statusCode).toBe(OK);
    const result = JSON.parse(String(res4.getBody()));

    expect(result).toMatchObject({ sharedMessageId: expect.any(Number) });

    const res8 = callingChannelMessages(user2.token, channel1.channelId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq//yes sir', messageId: result.sharedMessageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });
});

describe('Testing message pin', () => {
  test('messageId is not a valid message within a channel or DM that the authorised user has joined', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res2 = callingAuthRegister('email13@gmail.com', 'password13', 'first13', 'last13');
    expect(res2.statusCode).toBe(OK);
    const user3 = JSON.parse(res2.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessagePin(user3.token, message1.messageId);
    expect(res4.statusCode).toBe(400);
  });

  test('the message is already pinned', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessagePin(user1.token, message1.messageId);
    expect(res4.statusCode).toBe(OK);

    const res2 = callingMessagePin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(400);
  });

  test('messageId refers to a valid message in a joined channel and the authorised user does not have owner permissions in the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'cahnel', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const res9 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res9.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessagePin(user2.token, message1.messageId);
    expect(res2.statusCode).toBe(403);
  });

  test('messageId refers to a valid message in a joined DM and the authorised user does not have owner permissions in the DM', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessagePin(user2.token, message1.messageId);
    expect(res4.statusCode).toBe(403);
  });

  test('successful pin of message in dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessagePin(user1.token, message1.messageId);
    expect(res4.statusCode).toBe(OK);

    const res8 = callingDmMessages(user1.token, dm1.dmId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: true }], start: 0, end: -1 });
  });

  test('successful pin of message in channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'cahnel', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const res9 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res9.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessagePin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(OK);

    const res8 = callingChannelMessages(user1.token, channel1.channelId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: true }], start: 0, end: -1 });
  });

  test('invalid token test', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'cahnel', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const res9 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res9.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessagePin('-9999', message1.messageId);
    expect(res2.statusCode).toBe(400);
  });
});

describe('Testing message unpin', () => {
  test('messageId is not a valid message within a channel or DM that the authorised user has joined', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res2 = callingAuthRegister('email13@gmail.com', 'password13', 'first13', 'last13');
    expect(res2.statusCode).toBe(OK);
    const user3 = JSON.parse(res2.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageUnpin(user3.token, message1.messageId);
    expect(res4.statusCode).toBe(400);
  });

  test('the message is not already pinned', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessageUnpin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(400);
  });

  test('messageId refers to a valid message in a joined channel and the authorised user does not have owner permissions in the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'cahnel', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const res9 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res9.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessagePin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(OK);

    const res8 = callingMessageUnpin(user2.token, message1.messageId);
    expect(res8.statusCode).toBe(403);
  });

  test('messageId refers to a valid message in a joined DM and the authorised user does not have owner permissions in the DM', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessagePin(user1.token, message1.messageId);
    expect(res4.statusCode).toBe(OK);

    const res2 = callingMessageUnpin(user2.token, message1.messageId);
    expect(res2.statusCode).toBe(403);
  });

  test('successful unpin of message in dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessagePin(user1.token, message1.messageId);
    expect(res4.statusCode).toBe(OK);

    const res2 = callingMessageUnpin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(OK);

    const res8 = callingDmMessages(user1.token, dm1.dmId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('successful unpin of message in channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'cahnel', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const res9 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res9.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessagePin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(OK);

    const res4 = callingMessageUnpin(user1.token, message1.messageId);
    expect(res4.statusCode).toBe(OK);

    const res8 = callingChannelMessages(user1.token, channel1.channelId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res8.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('invalid token test', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'cahnel', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const res9 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res9.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res2 = callingMessagePin(user1.token, message1.messageId);
    expect(res2.statusCode).toBe(OK);

    const res4 = callingMessageUnpin('-9999', message1.messageId);
    expect(res4.statusCode).toBe(400);
  });
});

describe('Testing message send later', () => {
  test('channelId does not refer to a valid channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLater(user1.token, -99999, 'hello future Dillon', time);
    expect(res2.statusCode).toBe(400);
  });

  test('Length of message is less than 1 character', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLater(user1.token, channel1.channelId, '', time);
    expect(res2.statusCode).toBe(400);
  });

  test('Length of message is greater than 1000 characters', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLater(user1.token, channel1.channelId, 'KDdEGFgpnTi9PztCX4vql1j01QEVzGKawqsh0GZMBJy7b9cBwnwApZQATmCcMouwXI1rQMv6OCiGJB8CVT6DWyYahEOMO4Am6zS4WTO8ldZ3Gg8sMdf67BMsAgVvEdTuErZO4VB3howxxksbcoEObaon9ae9LApRnsnGNEaZZ4Y48T6Ui8srgSOGAkHEAMMfKuZ03gE2ZLH63bOpWFyOtBprY3L7V89pzP4ufPRpDggn2OOf3cGFJu2tkzw5XPAv8BMlXJgoWVjUw3MpOoTcibk9oKmEqAXG7D7YQVEqXfidg2SSNjvvSIpf70TohAktRMbca8MHrVXeeldSkZiHuBhGO0A6FEvAENUsAzpopcccepy1Oyb9JAxeXUeO5liJoJAJk2BBaBO3MVcRU8yDpb1gdV9o4xoL0YyHplntaoikT8guBfeMkwwzpbE2sMWgU4Ibhhqn7LGYHSi3SDQzR0oyaHyImKL8ct7m1vmJmziGyxW9EPceWw4AclKzRB1mA9YVMsHQUt0atiTUzNgXyHlz1mbJjGP9UWGeIu9tda4baayZKqJUAOXzBbeVjEMBQszDzn6XxQ3wOOicAd0RFQlfxd86CGgGRDlSc1jvaorCLPEcXOnyrIfKML3jUQ6wRoqtweJ1H7EbpJ0Aiao2Cx0vKhvlRp9YJTV4ovabIZHSKIi3ezGhK9oQQHXZTihmEJWaNd5zYTSfGe3xU6fXyOF4Dvr39BbeVkqp5l9cRZL0yr7T6CHNgqojTE7R7sCX2wNtMlsI2ihfWvjldeAugRs28Ag9FLX2DqwjT2cqqXn3tVT2sGglfhUGsrWNM2P5QJx1e8udgNxz1uRjjaxHd6aeqi1FipEFOLLS9QR4IgDM0EWjayUWS5chz5BYiOCthQCXjOPFTOULTKDEzEiaotsEeX7zi5mJcaQ5piK2A5YBhJzAIiHekFjyBcZ9uPRNr3XiJ8Nf0qUFUkjTwYTq2hGVzjgOLA08KdzGhEnHi', time);
    expect(res2.statusCode).toBe(400);
  });

  test('Timesent is in the past', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() - 100000) / 1000);

    const res2 = callingMessageSendLater(user1.token, channel1.channelId, 'Hello Future Dillon', time);
    expect(res2.statusCode).toBe(400);
  });

  test('channelId is valid and the authorised user is not a member of the channel they are trying to post to', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLater(user2.token, channel1.channelId, 'Hello Future Dillon', time);
    expect(res2.statusCode).toBe(403);
  });

  test('succesful message sent later', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 10000) / 1000);

    const res2 = callingMessageSendLater(user1.token, channel1.channelId, 'Hello Future Dillon', time);
    expect(res2.statusCode).toBe(OK);
  });

  test('invalid token test', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res5 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res5.statusCode).toBe(OK);
    const channel1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 10000) / 1000);

    const res2 = callingMessageSendLater('-9999', channel1.channelId, 'Hello Future Dillon', time);
    expect(res2.statusCode).toBe(400);
  });
});

describe('Testing message send later dm', () => {
  test('dmId does not refer to a valid dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email2@gmail.com', 'password12', 'first21', 'las2t1');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLaterDm(user1.token, -99999, 'hello future Dillon', time);
    expect(res2.statusCode).toBe(400);
  });

  test('Length of message is less than 1 character', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last21');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLaterDm(user1.token, dm1.dmId, '', time);
    expect(res2.statusCode).toBe(400);
  });

  test('Length of message is greater than 1000 characters', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password21', 'first12', 'last21');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLater(user1.token, dm1.dmId, 'KDdEGFgpnTi9PztCX4vql1j01QEVzGKawqsh0GZMBJy7b9cBwnwApZQATmCcMouwXI1rQMv6OCiGJB8CVT6DWyYahEOMO4Am6zS4WTO8ldZ3Gg8sMdf67BMsAgVvEdTuErZO4VB3howxxksbcoEObaon9ae9LApRnsnGNEaZZ4Y48T6Ui8srgSOGAkHEAMMfKuZ03gE2ZLH63bOpWFyOtBprY3L7V89pzP4ufPRpDggn2OOf3cGFJu2tkzw5XPAv8BMlXJgoWVjUw3MpOoTcibk9oKmEqAXG7D7YQVEqXfidg2SSNjvvSIpf70TohAktRMbca8MHrVXeeldSkZiHuBhGO0A6FEvAENUsAzpopcccepy1Oyb9JAxeXUeO5liJoJAJk2BBaBO3MVcRU8yDpb1gdV9o4xoL0YyHplntaoikT8guBfeMkwwzpbE2sMWgU4Ibhhqn7LGYHSi3SDQzR0oyaHyImKL8ct7m1vmJmziGyxW9EPceWw4AclKzRB1mA9YVMsHQUt0atiTUzNgXyHlz1mbJjGP9UWGeIu9tda4baayZKqJUAOXzBbeVjEMBQszDzn6XxQ3wOOicAd0RFQlfxd86CGgGRDlSc1jvaorCLPEcXOnyrIfKML3jUQ6wRoqtweJ1H7EbpJ0Aiao2Cx0vKhvlRp9YJTV4ovabIZHSKIi3ezGhK9oQQHXZTihmEJWaNd5zYTSfGe3xU6fXyOF4Dvr39BbeVkqp5l9cRZL0yr7T6CHNgqojTE7R7sCX2wNtMlsI2ihfWvjldeAugRs28Ag9FLX2DqwjT2cqqXn3tVT2sGglfhUGsrWNM2P5QJx1e8udgNxz1uRjjaxHd6aeqi1FipEFOLLS9QR4IgDM0EWjayUWS5chz5BYiOCthQCXjOPFTOULTKDEzEiaotsEeX7zi5mJcaQ5piK2A5YBhJzAIiHekFjyBcZ9uPRNr3XiJ8Nf0qUFUkjTwYTq2hGVzjgOLA08KdzGhEnHi', time);
    expect(res2.statusCode).toBe(400);
  });

  test('Timesent is in the past', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email21@gmail.com', 'password12', 'first21', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() - 100000) / 1000);

    const res2 = callingMessageSendLaterDm(user1.token, dm1.dmId, 'hello future Dillon', time);
    expect(res2.statusCode).toBe(400);
  });

  test('channelId is valid and the authorised user is not a member of the channel they are trying to post to', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last132');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res8 = callingAuthRegister('email123@gmail.com', 'password123', 'first13', 'last13');
    expect(res8.statusCode).toBe(OK);
    const user3 = JSON.parse(res8.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLaterDm(user3.token, dm1.dmId, 'hello future Dillon', time);
    expect(res2.statusCode).toBe(403);
  });

  test('succesful message sent later', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLaterDm(user1.token, dm1.dmId, 'Hello Future Dillon', time);
    expect(res2.statusCode).toBe(OK);
  });

  test('invalid token test', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res7 = callingAuthRegister('email12@gmail.com', 'password12', 'first12', 'last12');
    expect(res7.statusCode).toBe(OK);
    const user2 = JSON.parse(res7.body as string);

    const res5 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res5.statusCode).toBe(OK);
    const dm1 = JSON.parse(res5.body as string);

    const time = Math.floor((Date.now() + 100000) / 1000);

    const res2 = callingMessageSendLaterDm('-999999', dm1.dmId, 'Hello Future Dillon', time);
    expect(res2.statusCode).toBe(400);
  });
});
