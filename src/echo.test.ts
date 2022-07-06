// Uncomment Below 2 lines once server is setup
// import request from 'sync-request';
// import config from './config.json';
import { echo } from './echo';

// Uncomment Below 3 lines once server is setup
// const OK = 200;
// const port = config.port;
// const url = config.url;

test('Filler', () => {
  expect(echo('filler')).toBe('filler');
});

// Iteration 2
// Uncomment Below lines once server is setup
/*
describe('HTTP tests using Jest', () => {
  test('Test successful echo', () => {
    const res = request(
      'GET',
            `${url}:${port}/echo`,
            {
              qs: {
                echo: 'Hello',
              }
            }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual('Hello');
  });
  test('Test invalid echo', () => {
    const res = request(
      'GET',
            `${url}:${port}/echo`,
            {
              qs: {
                echo: 'echo',
              }
            }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
});
*/
