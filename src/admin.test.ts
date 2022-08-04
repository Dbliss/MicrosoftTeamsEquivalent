import request from 'sync-request';
import { callingChannelsCreate } from './channelsServer.test';
import config from './config.json';
import { callingDmCreate } from './dm.test';
import { callingMessageSend } from './message.test';
import { involvementRateCalc, utilizationRateCalc } from './other';
const OK = 200;
const port = config.port;
const url = config.url;

// function callingChannelDetails (token: string, channelId: number) {
//     const res = request(
//         'GET',
//         `${url}:${port}/channel/details/v2`,
//         {
//             qs: {
//                 token: token,
//                 channelId: channelId,
//             }
//         }
//     );
//     return res;
// }

// function callingChannelJoin (token: string, channelId: number) {
//     const res = request(
//         'POST',
//         `${url}:${port}/channel/details/v2`,
//         {
//             body: JSON.stringify({
//                 token: token,
//                 channelId: channelId,
//             }),
//             headers: {
//                 'Content-type': 'application/json',
//             },
//         }
//     );
//     return res;
// }

function callingClear () {
  const res = request(
    'DELETE',
        `${url}:${port}/clear/v1`
  );
  expect(res.statusCode).toBe(OK);
}

function callingAuthRegister (email:string, password:string, nameFirst:string, nameLast:string) {
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
  // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserRemove(token: string, uId: number) {
  const res = request(
    'DELETE',
        `${url}:${port}/admin/user/remove/v1`,
        {
          qs: {
            uId: uId,
          },
          headers: {
            token: token,
          }
        }
  );
  return res;
}

function callingUserPermissionChange (token: string, uId: number, permissionId: number) {
  const res = request(
    'POST',
        `${url}:${port}/admin/userpermission/change/v1`,
        {
          body: JSON.stringify({
            uId: uId,
            permissionId: permissionId,
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  // expect(res.statusCode).toBe(OK);
  return res;
}

describe('Testing admin/user/remove/v1', () => {
  test('Testing successful return of users object from users/all/v1', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const uId = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const res = callingUserRemove(authUserId.token, uId.authUserId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({});
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));
    const result = callingUserRemove('', authUserId.authUserId);
    expect(result.statusCode).toBe(403); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });

  test('Testing error return when invalid uId given', () => {
    callingClear();
    const authUserId = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));
    const result = callingUserRemove(authUserId.token, -5);
    expect(result.statusCode).toBe(400); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});

describe('Testing admin/userpermission/change/v1', () => {
  test('Testing successful return', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalMember = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const res = callingUserPermissionChange(globalOwner.token, globalMember.authUserId, 1);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));

    expect(result).toStrictEqual({});
  });

  test('Testing error when uId is not valid', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalMember = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const res = callingUserPermissionChange(globalOwner.token, -3, 1);
    expect(res.statusCode).toBe(400);
  });

  test('Testing error when permissionId is not valid', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalMember = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const res = callingUserPermissionChange(globalOwner.token, globalMember.authUserId, 6);
    expect(res.statusCode).toBe(400);
  });

  test('Testing error when globalMember tries to change perms', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalOwner2 = JSON.parse(String(callingAuthRegister('email23@email.com',
      'password23',
      'First23',
      'Last23').getBody()));

    const res2 = callingUserPermissionChange(globalOwner.token, globalOwner2.authUserId, 1);
    expect(res2.statusCode).toBe(OK);

    const globalMember = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const res = callingUserPermissionChange(globalMember.token, globalOwner2.authUserId, 2);
    expect(res.statusCode).toBe(403);
  });

  test('Testing error when the only globalOwner is being demoted', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const res = callingUserPermissionChange(globalOwner.token, globalOwner.authUserId, 2);
    expect(res.statusCode).toBe(400);
  });

  test('Testing error when user already has perms', () => {
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalOwner2 = JSON.parse(String(callingAuthRegister('email23@email.com',
      'password23',
      'First23',
      'Last23').getBody()));

    const res2 = callingUserPermissionChange(globalOwner.token, globalOwner2.authUserId, 1);
    expect(res2.statusCode).toBe(OK);

    const res = callingUserPermissionChange(globalOwner.token, globalOwner2.authUserId, 1);
    expect(res.statusCode).toBe(400);
  });

  test('Testing error return when invalid token is given', () => {
    callingClear();
    callingClear();
    const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').getBody()));

    const globalMember = JSON.parse(String(callingAuthRegister(
      'email1@email.com',
      'password1',
      'First1',
      'Last1').getBody()));

    const res = callingUserPermissionChange('', globalMember.authUserId, 1);
    expect(res.statusCode).toBe(403);
    // const result = JSON.parse(String(res.getBody()));
    // expect(result).toMatchObject({ error: 'error' }); // assuming that an invlaid token is given that it produces an error this
    // condition is not given in the spec
  });
});
