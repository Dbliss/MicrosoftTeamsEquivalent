import { callingClear, callingDmCreate, callingDmList, callingDmRemove, callingDmDetails, callingDmLeave, callingDmMessages, callingMessageSendDm, callingAuthRegister } from './helperFile';

const OK = 200;

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
    expect(result2).toMatchObject({ dms: [{ dmId: result.dmId, name: "'first2last2, first3last3, firstlast'" }] });
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
    expect(res.statusCode).toBe(400);
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
    expect(res.statusCode).toBe(400);
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(403);
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
    expect(result).toStrictEqual({ dms: [{ dmId: dm1.dmId, name: "'abclast, dadmom'" }] });
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
    expect(result).toStrictEqual({ dms: [{ dmId: dm1.dmId, name: "'first2last2, firstlast'" }] });
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
    expect(result).toMatchObject({
      dms: [
        { dmId: dmCreated1.dmId, name: "'first3last3, firstlast'" },
        { dmId: dmCreated2.dmId, name: "'first2last2, first3last3'" }]
    });
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(400);
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(403);
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
    expect(result2).toStrictEqual({ dms: [] });
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(400);
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

    const res = callingDmDetails(registered3.token, dm1.dmId);
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(400);
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(403);
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
    expect(res.statusCode).toBe(400);
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
    expect(res.statusCode).toBe(400);
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
    expect(res.statusCode).toBe(403);
  });

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

    for (let i = 55; i > 0; i--) {
      const message = callingMessageSendDm(registered1.token, dm1.dmId, JSON.stringify(i));
      expect(message.statusCode).toBe(OK);
      const message1 = JSON.parse(String(message.getBody()));
      expect(message1).toMatchObject({ messageId: expect.any(Number) });
    }

    const res = callingDmMessages(registered1.token, dm1.dmId, 0);
    expect(res.statusCode).toBe(OK);
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

    for (let i = 10; i > 0; i--) {
      const message = callingMessageSendDm(registered1.token, dm1.dmId, JSON.stringify(i));
      expect(message.statusCode).toBe(OK);
      const message1 = JSON.parse(String(message.getBody()));
      expect(message1).toMatchObject({ messageId: expect.any(Number) });
    }

    const res = callingDmMessages(registered1.token, dm1.dmId, 0);
    expect(res.statusCode).toBe(OK);
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

    for (let i = 55; i > 0; i--) {
      const message = callingMessageSendDm(registered1.token, dm1.dmId, JSON.stringify(i));
      expect(message.statusCode).toBe(OK);
      const message1 = JSON.parse(String(message.getBody()));
      expect(message1).toMatchObject({ messageId: expect.any(Number) });
    }

    const res = callingDmMessages(registered1.token, dm1.dmId, 10);
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({
      messages: [{
        isPinned: false,
        message: '11',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '12',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '13',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '14',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '15',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '16',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '17',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '18',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '19',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '20',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '21',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '22',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '23',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '24',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '25',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '26',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '27',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '28',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '29',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '30',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '31',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '32',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '33',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '34',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '35',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '36',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '37',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '38',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '39',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '40',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '41',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '42',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '43',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '44',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '45',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '46',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '47',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '48',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '49',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '50',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '51',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '52',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '53',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '54',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      {
        isPinned: false,
        message: '55',
        messageId: expect.any(Number),
        reacts: [],
        timeSent: expect.any(Number),
        uId: expect.any(Number),
      },
      ],
      start: 10,
      end: -1,
    });
  });
});

export { callingDmCreate, callingMessageSendDm, callingDmMessages, callingAuthRegister, callingDmLeave };
