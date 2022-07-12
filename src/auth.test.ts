import request from 'sync-request';
import config from './config.json';

const OK = 200;
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
      `${url}:${port}/auth/register/v2`,
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
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'emailemail.com', password: 'password123', nameFirst: 'first', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
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
      `${url}:${port}/auth/register/v2`,
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
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'emailemail.com', password: 'password123', nameFirst: 'first1', nameLast: 'last1'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
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
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'pass', nameFirst: 'first', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
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
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: '', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
    const res1 = request(
      'POST',
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', nameLast: 'last'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(bodyObj1).toMatchObject({ error: 'error' });
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
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: ''
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
    const res1 = request(
      'POST',
      `${url}:${port}/auth/register/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123', nameFirst: 'first', nameLast: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(bodyObj1).toMatchObject({ error: 'error' });
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
      `${url}:${port}/auth/register/v2`,
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
      `${url}:${port}/auth/login/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
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
      `${url}:${port}/auth/login/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: 'password123',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
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
      `${url}:${port}/auth/register/v2`,
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
      `${url}:${port}/auth/login/v2`,
      {
        body: JSON.stringify({
          email: 'email@email.com', password: '',
        }),
        headers: {
          'Content-type': 'application/json'
        },
      }
    );
    const bodyObj = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(bodyObj).toMatchObject({ error: 'error' });
  });
});
