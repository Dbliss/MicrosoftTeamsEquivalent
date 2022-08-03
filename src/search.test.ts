import { callingClear, callingAuthRegister, callingDmCreate, callingMessageSendDm, callingChannelInvite, callingChannelsCreate, callingMessageSend, callingSearch } from './helperFile';

const OK = 200;

describe('Testing Search', () => {
  test('Invalid Token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(auth1.statusCode).toBe(OK);

    const res = callingSearch('-99999', 'hi');
    expect(res.statusCode).toBe(403);
  });

  test('queryStr length < 1', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));

    const res = callingSearch(registered1.token, '');
    expect(res.statusCode).toBe(400);
  });

  test('queryStr length > 1000', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));

    let longString = '';
    for (let i = 0; i < 1001; i++) {
      longString = longString + i;
    }

    const res = callingSearch(registered1.token, longString);
    expect(res.statusCode).toBe(400);
  });

  test('Valid Parameters, Search from both dm and channel messages', () => {
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

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dmCreated = JSON.parse(String(dm.getBody()));

    const dmmessage = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Hey Whats going on?');
    expect(dmmessage.statusCode).toBe(OK);
    const dmmessageCreated = JSON.parse(String(dmmessage.getBody()));

    const channel = callingChannelsCreate(registered1.token, 'ChannelName', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
    expect(join.statusCode).toBe(OK);

    const channelMessage = callingMessageSend(registered2.token, channelCreated.channelId, 'Why and what is happening?');
    expect(channelMessage.statusCode).toBe(OK);
    const channelMessageCreated = JSON.parse(String(channelMessage.getBody()));

    const res = callingSearch(registered2.token, 'what');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      messages: [{
        messageId: dmmessageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Hey Whats going on?',
        timeSent: expect.any(Number),
        reacts: [],
        isPinned: false,
      },
      {
        messageId: channelMessageCreated.messageId,
        uId: registered2.authUserId,
        message: 'Why and what is happening?',
        timeSent: expect.any(Number),
        reacts: [],
        isPinned: false,
      },
      ]
    });
  });

  test('Valid Parameters, Search from dm messages(2 messages 1 matching)', () => {
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

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dmCreated = JSON.parse(String(dm.getBody()));

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Hey Whats going on?');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const message2 = callingMessageSendDm(registered2.token, dmCreated.dmId, 'Hey I am good?');
    expect(message2.statusCode).toBe(OK);

    const res = callingSearch(registered2.token, 'what');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      messages: [{
        messageId: messageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Hey Whats going on?',
        timeSent: expect.any(Number),
        reacts: [],
        isPinned: false,
      }]
    });
  });

  test('Valid Parameters, Search from channel messages', () => {
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

    const channel = callingChannelsCreate(registered1.token, 'ChannelName', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
    expect(join.statusCode).toBe(OK);

    const channelMessage = callingMessageSend(registered2.token, channelCreated.channelId, 'Why and what is happening?');
    expect(channelMessage.statusCode).toBe(OK);
    const channelMessageCreated = JSON.parse(String(channelMessage.getBody()));

    const channelMessage2 = callingMessageSend(registered2.token, channelCreated.channelId, 'I am not sure');
    expect(channelMessage2.statusCode).toBe(OK);

    const res = callingSearch(registered2.token, 'what');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      messages: [
        {
          messageId: channelMessageCreated.messageId,
          uId: registered2.authUserId,
          message: 'Why and what is happening?',
          timeSent: expect.any(Number),
          reacts: [],
          isPinned: false,
        },
      ]
    });
  });

  test('Valid Parameters, Member check', () => {
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

    const auth3 = callingAuthRegister('email3@email.com',
      'password3',
      'First3',
      'Last3');
    expect(auth3.statusCode).toBe(OK);
    const registered3 = JSON.parse(String(auth3.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId, registered3.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dmCreated = JSON.parse(String(dm.getBody()));

    const dmmessage = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Hey Whats going on?');
    expect(dmmessage.statusCode).toBe(OK);
    const dmmessageCreated = JSON.parse(String(dmmessage.getBody()));

    const channel = callingChannelsCreate(registered1.token, 'ChannelName', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
    expect(join.statusCode).toBe(OK);

    const channelMessage = callingMessageSend(registered2.token, channelCreated.channelId, 'Why and what is happening?');
    expect(channelMessage.statusCode).toBe(OK);

    const res = callingSearch(registered3.token, 'what');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      messages: [{
        messageId: dmmessageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Hey Whats going on?',
        timeSent: expect.any(Number),
        reacts: [],
        isPinned: false,
      }
      ]
    });
  });
});
