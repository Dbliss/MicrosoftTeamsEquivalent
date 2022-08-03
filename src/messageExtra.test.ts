import { callingDmCreate, callingMessageSendDm, callingDmMessages, callingClear, callingChannelsCreate, callingAuthRegister, callingMessageSend, callingMessageShare, callingChannelMessages} from './helperFile';

const OK = 200;

describe('Testing message Share', () => {
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

    const res7 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
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

    const res7 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
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

  test('succesful message share to a channel', () => {
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

  });


  test('succesful message share to a dm', () => {
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

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(String(res3.getBody()));

    const res4 = callingMessageShare(user2.token, message1.messageId, 'yes sir', -1, dm1.dmId);
    expect(res4.statusCode).toBe(OK);
    const result = JSON.parse(String(res4.getBody()));

    expect(result).toMatchObject({ sharedMessageId: expect.any(Number) });

    const res8 = callingDmMessages(user1.token, dm1.dmId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res4.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq|---|yes sir', messageId: result.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('succesful message share to a channel', () => {
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

    const res8 = callingChannelMessages(user1.token, channel1.channelId, 0);
    expect(res8.statusCode).toBe(OK);
    const messages = JSON.parse(res4.body as string);

    expect(messages).toEqual({ messages: [{ message: 'heaqaewqeuhq|---|yes sir', messageId: result.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });
});
