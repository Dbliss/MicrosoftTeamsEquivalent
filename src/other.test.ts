import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

describe('Testing clearV1', () => {
  test('Testing succesfull return of clearV1()', () => {
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
    const member = JSON.parse(String(res.getBody()));

    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    const res2 = request(
      'GET',
        `${url}:${port}/channels/listall/v3`,
        {
          headers: {
            token: member.token
          },
        }
    );
    expect(res2.statusCode).toBe(403);
  });
});
