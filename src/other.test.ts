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
    del('clear/v1', '');
    /* const res1 = request(
      'GET',
        `${url}:${port}/channels/listall/v2`,
        {
          qs: {
            token: 'tokenTest',
          },
        }
    );
    const bodyObj1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);
    expect(bodyObj1).toMatchObject({ channels: [] }); */
  });
});
