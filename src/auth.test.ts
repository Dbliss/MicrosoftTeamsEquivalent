import request from 'sync-request';
import config from './config.json';
import { callingClear } from './channelsServer.test';
import { callingAuthRegister } from './dm.test';

const OK = 200;
const BADREQ = 400;
const FORBID = 403;
const port = config.port;
const url = config.url;

describe('Test auth/register/v2', () => {
  test('Successfully returns authUserId', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ token: expect.any(String), authUserId: expect.any(Number) });
  });

  test('Invalid email', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'emailemail.com', password: 'password123', nameFirst: 'first', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(BADREQ);
  });

  test('email taken by another user', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(OK);
    const res1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'emailemail.com', password: 'password123', nameFirst: 'first1', nameLast: 'last1'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res1.statusCode).toBe(BADREQ);
  });

  test('password length less than 6 characters', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'pass', nameFirst: 'first', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(BADREQ);
  });

  test('length of first name not between 1 and 50 characters inclusive', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: '', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(BADREQ);
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res1.statusCode).toBe(BADREQ);
  });

  test('length of last name not between 1 and 50 characters inclusive', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: ''
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(BADREQ);
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res1.statusCode).toBe(BADREQ);
  });
});

describe('Test auth/login/v2', () => {
  test('Login successful', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: 'last',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(OK);
    const res1 = request(
      'POST',
      `${url}:${port}/auth/login/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(String(res1.getBody()));
    expect(res1.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ token: expect.any(String), authUserId: expect.any(Number) });
  });
  test('email does not belong to any user', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/login/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(BADREQ);
  });
  test('password is not correct', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: 'last',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(OK);
    const res1 = request(
      'POST',
      `${url}:${port}/auth/login/v3`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: '',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res1.statusCode).toBe(BADREQ);
  });
});

describe('Test auth/logout/v2', () => {
  test('Invalid token is passed in', () => {
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res = request(
      'POST',
      `${url}:${port}/auth/logout/v2`,
      {
        body: JSON.stringify({
          token: '',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    expect(res.statusCode).toBe(FORBID);
  });
});

function callingPasswordRequest (token: string, email: string) {
  const res = request(
    'POST',
      `${url}:${port}/auth/passwordreset/request/v1`,
      {
        body: JSON.stringify({
          email: email
        }),
        headers: {
          token: token,
          'Content-type': 'application/json',
        },
      }
  );
  return res;
}

function callingPasswordReset (token: string, resetCode: string, newPassword:string) {
  const res = request(
    'POST',
    `${url}:${port}/auth/passwordreset/reset/v1`,
    {
      body: JSON.stringify({
        resetCode: resetCode,
        newPassword: newPassword
      }),
      headers: {
        token: token,
        'Content-type': 'application/json',
      },
    }
  );
  return res;
}

describe('Test auth/passwordreset/request/v1', () => {
  test('Success', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const request = callingPasswordRequest(
      member.token,
      'thevin369@gmail.com'
    );
    expect(request.statusCode).toBe(OK);
    const requested = JSON.parse(String(request.getBody()));
    expect(requested).toStrictEqual({});
  });
  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const request = callingPasswordRequest(
      '',
      'thevin369@gmail.com'
    );
    expect(request.statusCode).toBe(FORBID);
  });
});

describe('Test auth/passwordreset/reset/v1', () => {
  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const reset = callingPasswordReset(
      '',
      '123456789',
      'newPassword'
    );
    expect(reset.statusCode).toBe(FORBID);
  });
  test('Invalid password', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const reset = callingPasswordReset(
      member.token,
      '123456789',
      ''
    );
    expect(reset.statusCode).toBe(BADREQ);
  });
  test('Invalid reset code', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const reset = callingPasswordReset(
      member.token,
      '',
      'newPassword'
    );
    expect(reset.statusCode).toBe(BADREQ);
  })
})