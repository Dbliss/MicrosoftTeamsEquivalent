// Importing functions from channels.js file
import request from 'sync-request';
import config from './config.json';

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
    callingClear();

    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const res = callingDmCreate(registered1.token, [registered2.authUserId]);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ dmId: expect.any(Number) });
  });

  test('Valid parameters, adding 2 users in dm', () => {
    callingClear();

    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const auth3 = callingAuthRegister('email3@email.com',
      'password3',
      'First3',
      'Last3');
    const registered3 = JSON.parse(String(auth3.getBody()));

    const res = callingDmCreate(registered1.token, [registered2.authUserId, registered3.authUserId]);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ dmId: expect.any(Number) });

    const res2 = callingDmList(registered1.token);
    const result2 = JSON.parse(String(res2.getBody()));
    expect(result2).toMatchObject([{ dmId: result.dmId, name: "'first2last2, first3last3, firstlast'" }]);
  });

  test('Invalid uId', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const res = callingDmCreate(registered1.token, [-9999]);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Repeat uIds', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const res = callingDmCreate(registered1.token, [registered2.authUserId, registered2.authUserId]);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Invalid token', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const res = callingDmCreate('-9999', [registered2.authUserId]);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });
});

describe('Testing dmList', () => {
  test('Invalid token', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');

    const res = callingDmList('-9999');
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Valid Parameters, 1 dm, Listing by owner', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'abc',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'dad',
      'mom');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmList(registered1.token);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual([{ dmId: dm1.dmId, name: "'abclast, dadmom'" }]);
  });

  test('Valid Parameters, 1 dm, Listing by member', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmList(registered2.token);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toStrictEqual([{ dmId: dm1.dmId, name: "'first2last2, firstlast'" }]);
  });

  test('Valid Parameters, 2 dm, Listing by member', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const auth3 = callingAuthRegister('email3@email.com',
      'password3',
      'First3',
      'Last3');
    const registered3 = JSON.parse(String(auth3.getBody()));

    const dm1 = callingDmCreate(registered1.token, [registered3.authUserId]);
    const dmCreated1 = JSON.parse(String(dm1.getBody()));

    const dm2 = callingDmCreate(registered2.token, [registered3.authUserId]);
    const dmCreated2 = JSON.parse(String(dm2.getBody()));

    const res = callingDmList(registered3.token);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject([
      { dmId: dmCreated1.dmId, name: "'first3last3, firstlast'" },
      { dmId: dmCreated2.dmId, name: "'first2last2, first3last3'" }]);
  });
});

describe('Testing dmRemove', () => {
  test('Invalid token', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const dm = callingDmList(registered1.token);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmRemove('-9999', dm1.dmId);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Invalid dmId', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    callingDmList(registered1.token);

    const res = callingDmRemove(registered1.token, -9999);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('User not the owner of dm', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmRemove(registered2.token, dm1.dmId);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ error: 'error' });
  });

  test('Valid dmId, but user not part of dm', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    const dm1 = JSON.parse(String(dm.getBody()));

    // ** Un comment when dmLeave is implemented
    // const leave = callingDmLeave(registered1.token, dm1.dmId);

    const res = callingDmRemove(registered1.token, dm1.dmId);
    const result = JSON.parse(String(res.getBody()));
    // expect(result).toMatchObject({ error: 'error' });
  });

  test('Valid Parameters', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));
    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingDmRemove(registered1.token, dm1.dmId);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({});

    const res2 = callingDmList(registered1.token);
    const result2 = JSON.parse(String(res2.getBody()));
    expect(result2).toStrictEqual([]);
  });
});

describe('Testing dmDetails', () => {

});

describe('Testing dmLeave', () => {

});

describe('Testing dmMessages', () => {

});
