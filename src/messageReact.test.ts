import request from 'sync-request';
import { callingChannelMessages } from './channel.test';
import { callingChannelsCreate } from './channelsServer.test';
import config from './config.json';
import { callingAuthRegister, callingDmCreate, callingDmMessages, callingMessageSendDm } from './dm.test';
import { callingMessageSend } from './message.test';

const OK = 200;
const url = config.url;
const port = config.port;

function callingMessageReact(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/react/v1`,
        {
          body: JSON.stringify({
            messageId: messageId,
            reactId: reactId
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingMessageUnreact(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/unreact/v1`,
        {
          body: JSON.stringify({
            messageId: messageId,
            reactId: reactId
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingClear () {
  const res = request(
    'DELETE',
        `${url}:${port}/clear/V1`
  );
  return res;
}

describe('Testing Message React', () => {
  test('Invalid Token', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact('-9999', messageCreated.messageId, 1);
    expect(res.statusCode).toBe(403);
  });
  test('Invalid MessageId', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);

    const res = callingMessageReact(registered1.token, -9999, 1);
    expect(res.statusCode).toBe(400);
  });
  test('Invalid ReactId', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 2);
    expect(res.statusCode).toBe(400);
  });
  test('React already exists DM', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res2 = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res2.statusCode).toBe(400);
  });

  test('React already Exists Channel', () => {
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

    const channel = callingChannelsCreate(registered1.token, 'Name', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const message = callingMessageSend(registered1.token, channelCreated.channelId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual({});

    const res3 = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res3.statusCode).toBe(400);
  });

  test('Valid Parameters DM Message', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual({});

    const res3 = callingMessageReact(registered2.token, messageCreated.messageId, 1);
    expect(res3.statusCode).toBe(OK);
    const result3 = JSON.parse(String(res3.getBody()));
    expect(result3).toStrictEqual({});

    const res2 = callingDmMessages(registered1.token, dmCreated.dmId, 0);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));

    expect(result2).toStrictEqual({
      messages: [{
        messageId: messageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Message',
        timeSent: expect.any(Number),
        reacts: [{
          reactId: 1,
          uIds: [registered1.authUserId, registered2.authUserId],
          isThisUserReacted: true
        }],
        isPinned: false
      }],
      start: 0,
      end: -1
    });
  });
  test('Valid Parameters Channel Message', () => {
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

    const channel = callingChannelsCreate(registered1.token, 'Name', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const message = callingMessageSend(registered1.token, channelCreated.channelId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual({});

    const res3 = callingMessageReact(registered2.token, messageCreated.messageId, 1);
    expect(res3.statusCode).toBe(OK);
    const result3 = JSON.parse(String(res3.getBody()));
    expect(result3).toStrictEqual({});

    const res2 = callingChannelMessages(registered1.token, channelCreated.channelId, 0);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));

    expect(result2).toStrictEqual({
      messages: [{
        messageId: messageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Message',
        timeSent: expect.any(Number),
        reacts: [{
          reactId: 1,
          uIds: [registered1.authUserId, registered2.authUserId],
          isThisUserReacted: true
        }],
        isPinned: false
      }],
      start: 0,
      end: -1
    });
  });
});

describe('Testing Message Unreact', () => {
  test('Invalid Token', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res2 = callingMessageUnreact('-9999', messageCreated.messageId, 1);
    expect(res2.statusCode).toBe(403);
  });
  test('Invalid MessageId', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res2 = callingMessageUnreact(registered1.token, -9999, 1);
    expect(res2.statusCode).toBe(400);
  });
  test('Invalid ReactId', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res2 = callingMessageUnreact(registered1.token, messageCreated.messageId, 2);
    expect(res2.statusCode).toBe(400);
  });
  test('React doesnt exists DM', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered2.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res2 = callingMessageUnreact(registered1.token, messageCreated.messageId, 1);
    expect(res2.statusCode).toBe(400);
  });
  test('React doesnt Exists Channel', () => {
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

    const channel = callingChannelsCreate(registered1.token, 'Name', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const message = callingMessageSend(registered1.token, channelCreated.channelId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res3 = callingMessageUnreact(registered1.token, messageCreated.messageId, 1);
    expect(res3.statusCode).toBe(400);
  });
  test('Valid Parameters DM Messages', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res2 = callingMessageUnreact(registered1.token, messageCreated.messageId, 1);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));
    expect(result2).toStrictEqual({});

    const res3 = callingDmMessages(registered1.token, dmCreated.dmId, 0);
    expect(res3.statusCode).toBe(OK);
    const result3 = JSON.parse(String(res3.getBody()));

    expect(result3).toStrictEqual({
      messages: [{
        messageId: messageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Message',
        timeSent: expect.any(Number),
        reacts: [{
          reactId: 1,
          uIds: [],
          isThisUserReacted: false
        }],
        isPinned: false
      }],
      start: 0,
      end: -1
    });
  });
  test('Valid Parameters Channel Message', () => {
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

    const channel = callingChannelsCreate(registered1.token, 'Name', false);
    expect(channel.statusCode).toBe(OK);
    const channelCreated = JSON.parse(String(channel.getBody()));

    const message = callingMessageSend(registered1.token, channelCreated.channelId, 'Message');
    expect(message.statusCode).toBe(OK);
    const messageCreated = JSON.parse(String(message.getBody()));

    const res = callingMessageReact(registered1.token, messageCreated.messageId, 1);
    expect(res.statusCode).toBe(OK);

    const res3 = callingMessageUnreact(registered1.token, messageCreated.messageId, 1);
    expect(res3.statusCode).toBe(OK);
    const result3 = JSON.parse(String(res3.getBody()));
    expect(result3).toStrictEqual({});

    const res2 = callingChannelMessages(registered1.token, channelCreated.channelId, 0);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));

    expect(result2).toStrictEqual({
      messages: [{
        messageId: messageCreated.messageId,
        uId: registered1.authUserId,
        message: 'Message',
        timeSent: expect.any(Number),
        reacts: [{
          reactId: 1,
          uIds: [],
          isThisUserReacted: false
        }],
        isPinned: false
      }],
      start: 0,
      end: -1
    });
  });
});

export { callingMessageReact };
