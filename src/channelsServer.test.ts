// Importing functions from channels.js file
import request from 'sync-request';
import config from './config.json';

const url = config.url;
const port = config.port;

function callingChannelsCreate (authUserId: number, name: string, isPublic: boolean) {
    const res = request(
        'POST',
        `${url}:${port}/channels/create/v2`,
        {
            body: JSON.stringify({
              authUserId: authUserId,
              name: name,
              isPublic: isPublic
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
        `${url}:${port}/clear`,
    );
    return res;
};


describe('Testing channelsCreateV1', () => {
    test('Name length < 1', () => {
        callingClear();
        const auth = callingAuthRegister(
            'email@email.com',
            'password',
            'First',
            'Last');
        const authUserId = JSON.parse(String(auth.getBody()));
        
        const res = callingChannelsCreate(authUserId.authUserId, '', false);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });

    });

    test('Name length > 20', () => {
        callingClear();
        const auth = callingAuthRegister(
            'email@email.com',
            'password',
            'First',
            'Last');
        const authUserId = JSON.parse(String(auth.getBody()));
        
        const res = callingChannelsCreate(
            authUserId.authUserId,
            'abcdefghijklmnopqrstuv',
            false);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });
      });

    test('Valid parameters', () => {
        callingClear();
        const auth = callingAuthRegister(
            'email@email.com',
            'password',
            'First',
            'Last');
        const authUserId = JSON.parse(String(auth.getBody()));

        const res = callingChannelsCreate(
            authUserId.authUserId,
            'name',
            false);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ channelId: expect.any(Number) });
    });

    test('Invalid authUserId', () => {
        callingClear();
        callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
    
        const res = callingChannelsCreate(
            -9999,
            'name',
            false);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });
    });
});