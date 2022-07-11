import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

describe('Testing clearV1', () => {
  test('Testing succesfull return of clearV1()', () => {
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
    /* const bodyObj = JSON.parse(res.body as string);
     const tokenTest = bodyObj.token; */
    expect(res.statusCode).toBe(OK);
    request(
      'DELETE',
        `${url}:${port}/clear/v1`,
        {
          qs: {
          },
        }
    );
    /* const res2 = request(
      'GET',
        `${url}:${port}/channels/listall/v2`,
        {
          qs: {
            token: 'tokenTest',
          },
        }
    );
    const bodyObj1 = JSON.parse(res2.body as string);
    expect(res2.statusCode).toBe(OK);
    expect(bodyObj1).toMatchObject({ channels: [] }); */
  });
});
