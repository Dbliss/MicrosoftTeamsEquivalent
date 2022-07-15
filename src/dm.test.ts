
import request from 'sync-request';
import config from './config.json';

const OK = 200;
const url = config.url;
const port = config.port;

function callingDmCreate(token: string, uIds: number[]) {
  const res = request(
    'POST',
        `${url}:${port}/dm/create/v1`,
        {
          body: JSON.stringify({
            token: token,
            uIds: uIds,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingDmList(token: string) {
  const res = request(
    'GET',
        `${url}:${port}/dm/list/v1`,
        {
          qs: {
            token: token
          }
        }
  );
  return res;
}

function callingDmRemove(token: string, dmId: number) {
  const res = request(
    'DELETE',
        `${url}:${port}/dm/remove/v1`,
        {
          qs: {
            token: token,
            dmId: dmId,
          }
        }
  );
  return res;
}

function callingDmDetails(token: string, dmId: number) {
  const res = request(
    'GET',
        `${url}:${port}/dm/details/v1`,
        {
          qs: {
            token: token,
            dmId: dmId,
          }
        }
  );
  return res;
}

function callingDmLeave(token: string, dmId: number) {
  const res = request(
    'POST',
        `${url}:${port}/dm/leave/v1`,
        {
          body: JSON.stringify({
            token: token,
            dmId: dmId,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingDmMessages(token: string, dmId: number, start: number) {
  const res = request(
    'GET',
        `${url}:${port}/dm/messages/v1`,
        {
          qs: {
            token: token,
            dmId: dmId,
            start: start,
          }
        }
  );
  return res;
}

function callingMessageSendDm(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
        `${url}:${port}/message/dmsend/v1`,
        {
          body: JSON.stringify({
            token: token,
            dmId: dmId,
            message: message,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingAuthRegister (email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
        `${url}:${port}/auth/register/v2`,
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
  return res;
}

function callingClear () {
  const res = request(
    'DELETE',
        `${url}:${port}/clear/V1`
  );
  return res;
}

describe('Testing dmCreate', () => {
  test('Valid parameters, adding 1 user in dm', () => {
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

    const res = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ dmId: expect.any(Number) });
  });

  test('Valid parameters, adding 2 users in dm', () => {
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

    const res = callingDmCreate(registered1.token, [registered2.authUserId, registered3.authUserId]);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ dmId: expect.any(Number) });

    const res2 = callingDmList(registered1.token);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));
    expect(result2).toMatchObject([{ dmId: result.dmId, name: "'first2last2, first3last3, firstlast'" }]);
  });

  test('Invalid uId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
      expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));

    const res = callingDmCreate(registered1.token, [-9999]);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Repeat uIds', () => {
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

    const res = callingDmCreate(registered1.token, [registered2.authUserId, registered2.authUserId]);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    expect(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').statusCode).toBe(OK);

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
      expect(auth2.statusCode).toBe(OK);
    const registered2 = JSON.parse(String(auth2.getBody()));

    const res = callingDmCreate('-9999', [registered2.authUserId]);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });
});

describe('Testing dmList', () => {
  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    expect(callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last').statusCode).toBe(OK);

    const res = callingDmList('-9999');
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Valid Parameters, 1 dm, Listing by owner', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'abc',
      'Last');
      expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'dad',
      'mom');
      expect(auth2.statusCode).toBe(OK);
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmList(registered1.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual([{ dmId: dm1.dmId, name: "'abclast, dadmom'" }]);
  });

  test('Valid Parameters, 1 dm, Listing by member', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmList(registered2.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual([{ dmId: dm1.dmId, name: "'first2last2, firstlast'" }]);
  });

  test('Valid Parameters, 2 dm, Listing by member', () => {
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

    const dm1 = callingDmCreate(registered1.token, [registered3.authUserId]);
    expect(dm1.statusCode).toBe(OK);
    const dmCreated1 = JSON.parse(String(dm1.getBody()));

    const dm2 = callingDmCreate(registered2.token, [registered3.authUserId]);
    expect(dm2.statusCode).toBe(OK);
    const dmCreated2 = JSON.parse(String(dm2.getBody()));

    const res = callingDmList(registered3.token);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject([
      { dmId: dmCreated1.dmId, name: "'first3last3, firstlast'" },
      { dmId: dmCreated2.dmId, name: "'first2last2, first3last3'" }]);
  });
});

describe('Testing dmRemove', () => {
  test('Invalid token', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmRemove('-9999', dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Invalid dmId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
      expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));

    const res = callingDmRemove(registered1.token, -9999);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('User not the owner of dm', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmRemove(registered2.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Valid dmId, but user not part of dm', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    expect(callingDmLeave(registered1.token, dm1.dmId).statusCode).toBe(OK);

    const res = callingDmRemove(registered1.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Valid Parameters', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmRemove(registered1.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({});

    const res2 = callingDmList(registered1.token);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));
    expect(result2).toStrictEqual([]);
  });
});

describe('Testing dmDetails', () => {
  test('invalid token', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmDetails('-9999', dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('invalid dmId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
      expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));

    const res = callingDmDetails(registered1.token, -9999);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('dmId valid, user not a member', () => {
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

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmDetails(registered3.authUserId, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('valid parameters', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmDetails(registered2.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      name: "'first2last2, firstlast'",
      members: [
        {
          uId: registered2.authUserId,
          email: 'email2@email.com',
          nameFirst: 'First2',
          nameLast: 'Last2',
          handleStr: 'first2last2',
        },
        {
          uId: registered1.authUserId,
          email: 'email@email.com',
          nameFirst: 'First',
          nameLast: 'Last',
          handleStr: 'firstlast',
        },
      ]
    });
  });

  test('valid parameters, multiple members', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmDetails(registered1.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      name: "'first2last2, first3last3, firstlast'",
      members: [

        {
          uId: registered2.authUserId,
          email: 'email2@email.com',
          nameFirst: 'First2',
          nameLast: 'Last2',
          handleStr: 'first2last2',
        },
        {
          uId: registered3.authUserId,
          email: 'email3@email.com',
          nameFirst: 'First3',
          nameLast: 'Last3',
          handleStr: 'first3last3',
        },
        {
          uId: registered1.authUserId,
          email: 'email@email.com',
          nameFirst: 'First',
          nameLast: 'Last',
          handleStr: 'firstlast',
        }]
    });
  });
});

describe('Testing dmLeave', () => {
  test('invalid token', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmLeave('-9999', dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('invalid dmId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
      expect(auth1.statusCode).toBe(OK);
    const registered1 = JSON.parse(String(auth1.getBody()));

    const res = callingDmLeave(registered1.token, -9999);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('dmId valid, user not a member', () => {
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

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmLeave(registered3.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('valid parameters, owner leaves', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));
    const res = callingDmLeave(registered1.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({});
  });

  test('valid parameters, member leaves', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));
    const res = callingDmLeave(registered2.token, dm1.dmId);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({});

    const res2 = callingDmDetails(registered1.token, dm1.dmId);
    expect(res2.statusCode).toBe(OK);
    const result2 = JSON.parse(String(res2.getBody()));
    expect(result2).toMatchObject({
      name: "'first2last2, firstlast'",
      members: [
        {
          uId: registered1.authUserId,
          email: 'email@email.com',
          nameFirst: 'First',
          nameLast: 'Last',
          handleStr: 'firstlast',
        }
      ]
    });
  });
});

describe('Testing dmMessages', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmMessages('-99999', dm1.dmId, 0);
    expect(res.statusCode).toBe(OK);
    const res1 = JSON.parse(String(res.getBody()));
    expect(res1).toMatchObject({ error: 'error' });
  });

  test('Invalid dmId', () => {
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

    expect(callingDmCreate(registered1.token, [registered2.authUserId]).statusCode).toBe(OK);

    const res = callingDmMessages(registered1.token, -99999, 0);
    expect(res.statusCode).toBe(OK);
    const res1 = JSON.parse(String(res.getBody()));
    expect(res1).toMatchObject({ error: 'error' });
  });

  test('Invalid Start', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmMessages(registered1.token, dm1.dmId, 1);
    expect(res.statusCode).toBe(OK);
    const res1 = JSON.parse(String(res.getBody()));
    expect(res1).toMatchObject({ error: 'error' });
  });

  test('User not member of DM', () => {
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

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmMessages(registered3.token, dm1.dmId, 0);
    expect(res.statusCode).toBe(OK);
    const res1 = JSON.parse(String(res.getBody()));
    expect(res1).toMatchObject({ error: 'error' });
  });
  /*
  test('Valid Parameters, 55 messgaes send, Receave 50', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    for (let i = 0; i < 55; i++) {
      const message = callingMessageSendDm(registered1.token, dm1.dmId, JSON.stringify(i));
      expect(message.statusCode).toBe(OK);
      const message1 = JSON.parse(String(message.getBody()));
      expect(message1).toMatchObject({ messageId: expect.any(Number) });
    }

    const res = callingDmMessages(registered1.token, dm1.dmI, 0);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      messages: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
        '41', '42', '43', '44', '45', '46', '47', '48', '49'],
      start: 0,
      end: 50,
    });
  });

  test('Valid Parameters, 10 messgaes send, Get 10', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    for (let i = 0; i < 10; i++) {
      const message = callingMessageSendDm(registered1.token, dm1.dmId, JSON.stringify(i));
      expect(message.statusCode).toBe(OK);
      const message1 = JSON.parse(String(message.getBody()));
      expect(message1).toMatchObject({ messageId: expect.any(Number) });
    }

    const res = callingDmMessages(registered1.token, dm1.dmI, 0);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      messages: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      start: 0,
      end: -1,
    });
  });

  test('Valid Parameters, 55 messgaes send, Start at 10', () => {
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
    const dm1 = JSON.parse(String(dm.getBody()));

    for (let i = 0; i < 55; i++) {
      const message = callingMessageSendDm(registered1.token, dm1.dmId, JSON.stringify(i));
      expect(message.statusCode).toBe(OK);
      const message1 = JSON.parse(String(message.getBody()));
      expect(message1).toMatchObject({ messageId: expect.any(Number) });
    }

    const res = callingDmMessages(registered1.token, dm1.dmI, 10);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      messages: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
        '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
        '51', '52', '53', '54'],
      start: 0,
      end: -1,
    });
  });
  */
});
