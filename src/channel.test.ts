// Importing the functions from channel.js file

import {
  channelDetailsV1,
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
} from './channel';

// importing other essential functions used in channel

import {
  channelsCreateV1,
} from './channels';

import {
  authRegisterV1,
} from './auth';

import {
  clearV1,
} from './other';
import { getData, setData } from './dataStore';

describe('Testing channelDetailsV1', () => {
  test('Testing successful return of channelDetailsV1', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const channelId = channelsCreateV1(authUser.authUserId, 'name', true);
    const result = channelDetailsV1(authUser.authUserId, channelId.channelId);
    expect(result).toMatchObject({
      name: 'name',
      isPublic: true,
      ownerMembers: [{
        uId: authUser.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }],
      allMembers: [{
        uId: authUser.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }]
    });
  });

  test('successful return of channelDetailsV1 with multiple members', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const authUser1 = authRegisterV1('email1@email.com',
      'password',
      'First1',
      'Last1');

    const channelId = channelsCreateV1(authUser.authUserId, 'name', true);

    channelJoinV1(authUser1.authUserId, channelId.channelId);

    const result = channelDetailsV1(authUser.authUserId, channelId.channelId);
    expect(result).toMatchObject({
      name: 'name',
      isPublic: true,
      ownerMembers: [{
        uId: authUser.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      }],
      allMembers: [{
        uId: authUser.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      },
      {
        uId: authUser1.authUserId,
        email: 'email1@email.com',
        nameFirst: 'First1',
        nameLast: 'Last1',
        handleStr: 'first1last1',
      }]
    });
  });

  test('Testing when the channelId is not valid ', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    channelsCreateV1(authUser.authUserId, 'name', true);

    const result = channelDetailsV1(-9999, -9999);
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Testing when the channelId is not valid ', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const channelId = -9999;

    const result = channelDetailsV1(authUser.authUserId, channelId);
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Testing when the authUserId is not valid ', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const channelId = channelsCreateV1(authUser.authUserId, 'name', true);

    const userId = -9999;

    const result = channelDetailsV1(userId, channelId.channelId);
    expect(result).toMatchObject({ error: 'error' });
  });

  test('channelId is valid but authUserId is not a member of the channel', () => {
    clearV1();
    const authUser1 = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const authUser2 = authRegisterV1('email2@email2.com',
      'password2',
      'First2',
      'Last2');

    const channelId = channelsCreateV1(authUser1.authUserId, 'name', true);

    const result = channelDetailsV1(authUser2.authUserId, channelId.channelId);
    expect(result).toMatchObject({ error: 'error' });
  });
});

describe('Testing channelJoinV1', () => {
  test('Person who created the channel tries to join', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const channelId = channelsCreateV1(authUser.authUserId, 'name', true);

    const result = channelJoinV1(authUser.authUserId, channelId.channelId);
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Person who did not create channel tries to join public channel', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const authUser1 = authRegisterV1('email1@email.com',
      'password1',
      'First1',
      'Last1'
    );

    /*
    const expected: usersType = {
      uId: authUser.authUserId,
      email: 'email@email.com',
      nameFirst: 'First',
      nameLast: 'Last',
      handleStr: 'firstlast',
    };

    const expected1: usersType = {
      uId: authUser1.authUserId,
      email: 'email1@email.com',
      nameFirst: 'First1',
      nameLast: 'Last1',
      handleStr: 'first1last1',
    };
    */
    const channelId = channelsCreateV1(authUser1.authUserId, 'name', true);

    channelDetailsV1(authUser1.authUserId, channelId.channelId);
    // expect(chDetails['allMembers']).toContainEqual(expected1);
    // expect(chDetails['allMembers']).not.toContainEqual(expected);

    const result = channelJoinV1(authUser.authUserId, channelId.channelId);
    channelDetailsV1(authUser1.authUserId, channelId.channelId);
    // expect(chDetails1['allMembers']).toContainEqual(expected);
    expect(result).toMatchObject({});
  });

  test('Person who did not create channel tries to join private channel', () => {
    clearV1();
    const authUser = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    authRegisterV1('email1@email.com',
      'password1',
      'First1',
      'Last1');

    const channelId = channelsCreateV1(authUser.authUserId, 'name', false);

    const result = channelJoinV1(authUser.authUserId, channelId.channelId);
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Private channel + global owner', () => {
    clearV1();
    const globalOwner = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const globalMember = authRegisterV1('email1@email.com',
      'password1',
      'First1',
      'Last1');

    const channelId = channelsCreateV1(globalMember.authUserId, 'name', false);

    const result = channelJoinV1(globalOwner.authUserId, channelId.channelId);
    expect(result).toMatchObject({});
  });
});

describe('Testing channelInvite1', () => {
  test('channelId does not refer to a valid channel', () => {
    clearV1();

    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const uId = authRegisterV1('email2@email.com', 'password2', 'First2', 'Last2');

    const result = channelInviteV1(authUserId.authUserId, -678678785675, uId.authUserId);

    expect(result).toMatchObject({ error: 'error' });
  });

  test('Uid refers to a user who is already a member of the channel', () => {
    clearV1();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    const result = channelInviteV1(authUserId.authUserId, channelId.channelId, authUserId.authUserId);

    expect(result).toMatchObject({ error: 'error' });
  });

  test('ChannelId is valid and the authorised user is not a member of the channel', () => {
    clearV1();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const authUserId2 = authRegisterV1('email2@email.com', 'password2', 'First2', 'Last2');

    const uId = authRegisterV1('email3@email.com', 'password3', 'First3', 'Last3');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    const result = channelInviteV1(authUserId2.authUserId, channelId.channelId, uId.authUserId);

    expect(result).toMatchObject({ error: 'error' });
  });

  test('no errors', () => {
    clearV1();

    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const uId = authRegisterV1('email3@email.com', 'password3', 'First3', 'Last3');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    const result = channelInviteV1(authUserId.authUserId, channelId.channelId, uId.authUserId);

    expect(result).toMatchObject({});
  });
});

describe('Testing channelMessages1', () => {
  test('channelId does not refer to a valid channel', () => {
    clearV1();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const result = channelMessagesV1(authUserId.authUserId, -6786545456, 0);

    expect(result).toMatchObject({ error: 'error' });
  });

  test('start is greater than the total number of messages in the channel', () => {
    clearV1();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    const result = channelMessagesV1(authUserId.authUserId, channelId.channelId, 9999999);

    expect(result).toMatchObject({ error: 'error' });
  });

  test('ChannelId is valid and the authorised user is not a member of the channel', () => {
    clearV1();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const authUserId2 = authRegisterV1('email2@email.com', 'password2', 'First2', 'Last2');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    const result = channelMessagesV1(authUserId2.authUserId, channelId.channelId, 0);

    expect(result).toMatchObject({ error: 'error' });
  });

  test('no errors', () => {
    clearV1();

    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    const result = channelMessagesV1(authUserId.authUserId, channelId.channelId, 0);

    expect(result).toEqual({ messages: [], start: 0, end: -1 });
  });

  test('multiple messages success', () => {
    clearV1();
    const data = getData();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    data.channel[0].messages = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    setData(data);

    const result = channelMessagesV1(authUserId.authUserId, channelId.channelId, 0);

    expect(result).toEqual({ messages: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], start: 0, end: -1 });
  });

  test('more than 50 messages success', () => {
    clearV1();
    const data = getData();
    const authUserId = authRegisterV1('email@email.com', 'password', 'First', 'Last');

    const channelId = channelsCreateV1(authUserId.authUserId, 'name', false);

    data.channel[0].messages = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
      '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
      '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];

    setData(data);

    const result = channelMessagesV1(authUserId.authUserId, channelId.channelId, 0);

    expect(result).toEqual({
      messages: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
        '41', '42', '43', '44', '45', '46', '47', '48', '49'],
      start: 0,
      end: 50
    });
  });
});
