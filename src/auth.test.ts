import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

const del = (path, qs) => {
  request(
    'DELETE',
    `${url}:${port}/${path}`,
    {
      qs: qs
    }
  );
};

describe('Test auth/register/v2', () => {
  test('Successfully returns authUserId', () => {
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
    del('clear/v1', '');
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
