import request from 'sync-request';
import config from './config.json';

const OK = 200;
const url = config.url;
const port = config.port;

import { callingAuthRegister, callingDmCreate, callingDmLeave, callingMessageSendDm } from './dm.test';
import { callingChannelsCreate } from './channelsServer.test';
import { callingChannelInvite } from './channel.test';
import { callingMessageSend } from './message.test';
import { requestChannelLeave } from './channelServer.test';
import { callingMessageReact } from './messageReact.test'

function callingNotificationsGet(token: string) {
  const res = request(
    'GET',
        `${url}:${port}/notifications/get/v1`,
        {
          headers: {
            token: token,
          }
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

describe('Testing Notifications', () => {
  test('Invalid Token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    expect(auth1.statusCode).toBe(OK);

    const res = callingNotificationsGet('-99999');
    expect(res.statusCode).toBe(403);
  });

  test('Valid, Has 25 notifications, Show 20', () => {
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

    for (let i = 0; i < 25; i++) {
      const message = callingMessageSendDm(registered1.token, dmCreated.dmId, '@first2last2 Hi');
      expect(message.statusCode).toBe(OK);
    }
    const res = callingNotificationsGet(registered2.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    const expectedNotification: any = { notifications: [] };

    expectedNotification.notifications.push({
      channelId: -1,
      dmId: dmCreated.dmId,
      notificationMessage: "firstlast added you to 'first2last2, firstlast'",
    });

    for (let i = 0; i < 19; i++) {
      expectedNotification.notifications.push({
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "firstlast tagged you in 'first2last2, firstlast': @first2last2 Hi",
      });
    }

    expect(result).toStrictEqual(expectedNotification);
  });

  test('Multiple tags', () => {
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

    const message = callingMessageSendDm(registered1.token, dmCreated.dmId, '@first2last2@firstlast Hi');
    expect(message.statusCode).toBe(OK);

    const res = callingNotificationsGet(registered2.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({
      notifications: [{
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "firstlast added you to 'first2last2, firstlast'",
      },
      {
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "firstlast tagged you in 'first2last2, firstlast': @first2last2@firstla",
      }
      ]
    });

    const res2 = callingNotificationsGet(registered1.token);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));

    expect(result2).toStrictEqual({
      notifications: [
        {
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast tagged you in 'first2last2, firstlast': @first2last2@firstla",
        }
      ]
    });
  });

  describe('DM notifications', () => {
    test('Valid, Tagged in dm message(less than 20 characters), Is member', () => {
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

      const message = callingMessageSendDm(registered1.token, dmCreated.dmId, '@first2last2 Hi');
      expect(message.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast added you to 'first2last2, firstlast'",
        },
        {
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast tagged you in 'first2last2, firstlast': @first2last2 Hi",
        }
        ]
      });
    });

    test('Valid, Tagged in dm message(More than 20 characters), Is member', () => {
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

      const message = callingMessageSendDm(registered1.token, dmCreated.dmId, '@first2last2 Whats up?');
      expect(message.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast added you to 'first2last2, firstlast'",
        },
        {
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast tagged you in 'first2last2, firstlast': @first2last2 Whats u",
        }
        ]
      });
    });

    test('Valid, Tagged in dm message, Is NOT member ', () => {
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

      const leave = callingDmLeave(registered2.token, dmCreated.dmId);
      expect(leave.statusCode).toBe(OK);

      const message = callingMessageSendDm(registered1.token, dmCreated.dmId, '@first2last2 Hi');
      expect(message.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast added you to 'first2last2, firstlast'",
        }
        ]
      });
    });
    
    test("Valid, Reacted to dm message, Is member", () => {
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

      const message = callingMessageSendDm(registered2.token, dmCreated.dmId, "@first2last2 Whats up?");
      expect(message.statusCode).toBe(OK);
      const messageSent = JSON.parse(String(message.getBody()));

      const reaction = callingMessageReact(registered1.token, messageSent.messageId, 1);
      expect(reaction.statusCode).toBe(OK);
      const reactionCreated = JSON.parse(String(reaction.getBody()));

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({notifications: [{
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "firstlast added you to 'first2last2, firstlast'",
      },
      {
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "first2last2 tagged you in 'first2last2, firstlast': @first2last2 Whats u",
      },
      {
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "firstlast reacted to your message in 'first2last2, firstlast'",
      }
      ]});
    });

    test("Valid, Reacted to dm message, Is NOT member ", () => {
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

      const message = callingMessageSendDm(registered2.token, dmCreated.dmId, "@first2last2 Whats up?");
      expect(message.statusCode).toBe(OK);
      const messageSent = JSON.parse(String(message.getBody()));

      const leave = callingDmLeave(registered2.token, dmCreated.dmId);
      expect(leave.statusCode).toBe(OK);

      const reaction = callingMessageReact(registered1.token, messageSent.messageId, 1);
      expect(reaction.statusCode).toBe(OK);
      const reactionCreated = JSON.parse(String(reaction.getBody()));

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({notifications: [{
        channelId: -1,
        dmId: dmCreated.dmId,
        notificationMessage: "firstlast added you to 'first2last2, firstlast'",
      },
      ]});
    });
    
    test('Valid, Added to dm', () => {
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

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: -1,
          dmId: dmCreated.dmId,
          notificationMessage: "firstlast added you to 'first2last2, firstlast'",
        }
        ]
      });
    });
  });

  describe('Channel Notifications', () => {
    test('Valid, Tagged in channel message(less than 20 chanracters), Is member', () => {
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

      const channel = callingChannelsCreate(registered1.token, 'channelName', true);
      expect(channel.statusCode).toBe(OK);
      const channelCreated = JSON.parse(String(channel.getBody()));

      const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
      expect(join.statusCode).toBe(OK);

      const message = callingMessageSend(registered1.token, channelCreated.channelId, '@first2last2 Hi!');
      expect(message.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: channelCreated.channelId,
          dmId: -1,
          notificationMessage: 'firstlast added you to channelName',
        },
        {
          channelId: channelCreated.channelId,
          dmId: -1,
          notificationMessage: 'firstlast tagged you in channelName: @first2last2 Hi!',
        }
        ]
      });
    });

    test('Valid, Tagged in channel message(more than 20 chanracters), Is member', () => {
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

      const channel = callingChannelsCreate(registered1.token, 'channelName', true);
      expect(channel.statusCode).toBe(OK);
      const channelCreated = JSON.parse(String(channel.getBody()));

      const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
      expect(join.statusCode).toBe(OK);

      const message = callingMessageSend(registered1.token, channelCreated.channelId, '@first2last2 Hi! How are you');
      expect(message.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: channelCreated.channelId,
          dmId: -1,
          notificationMessage: 'firstlast added you to channelName',
        },
        {
          channelId: channelCreated.channelId,
          dmId: -1,
          notificationMessage: 'firstlast tagged you in channelName: @first2last2 Hi! How',
        }
        ]
      });
    });

    test('Valid, Tagged in channel message, Is NOT member ', () => {
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

      const channel = callingChannelsCreate(registered1.token, 'channelName', true);
      expect(channel.statusCode).toBe(OK);
      const channelCreated = JSON.parse(String(channel.getBody()));

      const message = callingMessageSend(registered1.token, channelCreated.channelId, '@first2last2 Hi!');
      expect(message.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({ notifications: [] });
    });
    
    test("Valid, Reacted to channel message, Is member", () => {
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

      const channel = callingChannelsCreate(registered1.token, 'channelName', true);
      expect(channel.statusCode).toBe(OK);
      const channelCreated = JSON.parse(String(channel.getBody()));

      const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
      expect(join.statusCode).toBe(OK);
      const joinChannel = JSON.parse(String(join.getBody()));

      const message = callingMessageSend(registered2.token, channelCreated.channelId, '@first2last2 Hi!');
      expect(message.statusCode).toBe(OK);
      const messageSent = JSON.parse(String(message.getBody()));

      const react = callingMessageReact(registered1.token, messageSent.messageId, 1);
      expect(react.statusCode).toBe(OK);
      const reactSent = JSON.parse(String(react.getBody()));

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({notifications: [{
        channelId: channelCreated.channelId,
        dmId: -1,
        notificationMessage: "firstlast added you to channelName",
      },
      {
        channelId: channelCreated.channelId,
        dmId: -1,
        notificationMessage: "first2last2 tagged you in channelName: @first2last2 Hi!",
      },
      {
        channelId: channelCreated.channelId,
        dmId: -1,
        notificationMessage: "firstlast reacted to your message in channelName",
      }
      ]});
    });

    test("Valid, Reacted to channel message, Is NOT member ", () => {
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

      const channel = callingChannelsCreate(registered1.token, 'channelName', true);
      expect(channel.statusCode).toBe(OK);
      const channelCreated = JSON.parse(String(channel.getBody()));

      const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
      expect(join.statusCode).toBe(OK);
      const joinChannel = JSON.parse(String(join.getBody()));

      const message = callingMessageSend(registered2.token, channelCreated.channelId, '@first2last2 Hi!');
      expect(message.statusCode).toBe(OK);
      const messageSent = JSON.parse(String(message.getBody()));

      const leave = requestChannelLeave(registered2.token, channelCreated.channelId);
      console.log(leave);
      //expect(leave.statusCode).toBe(OK);
      //const leaveChannel = JSON.parse(String(leave.getBody()));

      const react = callingMessageReact(registered1.token, messageSent.messageId, 1);
      expect(react.statusCode).toBe(OK);
      const reactSent = JSON.parse(String(react.getBody()));

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({notifications: [{
        channelId: channelCreated.channelId,
        dmId: -1,
        notificationMessage: "firstlast added you to channelName",
      },
      ]});
    });
    
    test('Valid, added to channel', () => {
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

      const channel = callingChannelsCreate(registered1.token, 'channelName', true);
      expect(channel.statusCode).toBe(OK);
      const channelCreated = JSON.parse(String(channel.getBody()));

      const join = callingChannelInvite(registered1.token, channelCreated.channelId, registered2.authUserId);
      expect(join.statusCode).toBe(OK);

      const res = callingNotificationsGet(registered2.token);
      expect(res.statusCode).toBe(OK);
      const result = JSON.parse(String(res.getBody()));

      expect(result).toStrictEqual({
        notifications: [{
          channelId: channelCreated.channelId,
          dmId: -1,
          notificationMessage: 'firstlast added you to channelName',
        }
        ]
      });
    });
  });
});
