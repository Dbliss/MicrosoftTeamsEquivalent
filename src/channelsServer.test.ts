// Importing functions from channels.js file
import request from 'sync-request';
import { register } from 'ts-node';
import config from './config.json';

const url = config.url;
const port = config.port;

function callingChannelsCreate (token: string, name: string, isPublic: boolean) {
    const res = request(
        'POST',
        `${url}:${port}/channels/create/v2`,
        {
            body: JSON.stringify({
              token: token,
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

function callingChannelslist (token: string) {
    const res = request(
        'GET',
        `${url}:${port}/channels/list/v2`,
        {
            qs: {
                token: token
            }
        }
    );
    return res;
}

function callingChannelslistAll (token: string) {
    const res = request(
        'GET',
        `${url}:${port}/channels/listall/v2`,
        {
            qs: {
                token: token
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
        const registered = JSON.parse(String(auth.getBody()));
        
        const res = callingChannelsCreate(registered.token, '', false);
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
        const registered = JSON.parse(String(auth.getBody()));
        
        const res = callingChannelsCreate(
            registered.token,
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
        const registered = JSON.parse(String(auth.getBody()));

        const res = callingChannelsCreate(
            registered.token,
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
            '-9999',
            'name',
            false);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });
    });
});

describe('Testing channelsListV1', () => {
    test('Listing 2 channels user is part of', () => {
      callingClear();
      const auth = callingAuthRegister('email@email.com',
        'password',
        'First',
        'Last');
        const registered = JSON.parse(String(auth.getBody()));

      const channelId1 = callingChannelsCreate(registered.token,
        'name1',
        false);
        const channel1 = JSON.parse(String(channelId1.getBody()));
  
      const channelId2 = callingChannelsCreate(registered.token,
        'name2',
        true);
        const channel2 = JSON.parse(String(channelId2.getBody()));

      const result = callingChannelslist(registered.token);
      expect(result).toMatchObject({
        channels: [{
          channelId: channel1.channelId,
          name: 'name1'
        },
        {
          channelId: channel2.channelId,
          name: 'name2'
        }]
      });
    });

    test('Listing 1 channel user is part of', () => {
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
    
        callingChannelsCreate(registered1.token,
          'name1',
          false);
    
        const channelId = callingChannelsCreate(registered2.token,
          'name2',
          true);
          const channel = JSON.parse(String(channelId.getBody()));
    
        const result = callingChannelslist(registered2.token);
        const result1 = JSON.parse(String(result.getBody()));
        expect(result1).toMatchObject({
          channels: [{
            channelId: channel.channelId,
            name: 'name2'
          }]
        });
    });

    test('Listing 0 channels user is not part of any', () => {
        callingClear();
        const authUserId1 = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
          const registered1 = JSON.parse(String(authUserId1.getBody()));
    
        const authUserId2 = callingAuthRegister('email2@email.com',
          'password2',
          'First2',
          'Last2');
          const registered2 = JSON.parse(String(authUserId2.getBody()));
    
        callingChannelsCreate(registered1.token,
          'name1',
          false);
    
        callingChannelsCreate(registered1.token,
          'name2',
          true);
    
        const result = callingChannelslist(registered2.token);
        const result1 = JSON.parse(String(result.getBody()));
        expect(result1).toMatchObject({ channels: [] });
    });

    test('authUserId Invalid', () => {
        callingClear();
        const authUserId1 = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
          const registered = JSON.parse(String(authUserId1.getBody()));
        callingChannelsCreate(registered.token,
          'name1',
          false);
            
        const result = callingChannelslist('-99999');
        const result1 = JSON.parse(String(result.getBody()));
        expect(result1).toMatchObject({ channels: [] });
    });
});

describe('Testing channelsListV1', () => {

    test('Listing 2 channels created by user', () => {
        callingClear();
        const authUserId = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
          const registered = JSON.parse(String(authUserId.getBody()));
    
        const channelId1 = callingChannelsCreate(registered.token,
          'name1',
          false);
          const channel1 = JSON.parse(String(channelId1.getBody()));

    
        const channelId2 = callingChannelsCreate(registered.token,
          'name2',
          true);
          const channel2 = JSON.parse(String(channelId2.getBody()));

        const channels = callingChannelslistAll(registered.token);
        const result = JSON.parse(String(channels.getBody()));
        
        expect(result).toMatchObject({
          channels: [{
            channelId: channel1.channelId,
            name: 'name1'
          },
          {
            channelId: channel2.channelId,
            name: 'name2'
          }]
        });
    });

    test('Listing 2 channels user created 1', () => {
        callingClear();
        const authUserId1 = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
          const registered1 = JSON.parse(String(authUserId1.getBody()));
    
        const authUserId2 = callingAuthRegister('email2@email.com',
          'password2',
          'First2',
          'Last2');
          const registered2 = JSON.parse(String(authUserId2.getBody()));
    
        const channelId1 = callingChannelsCreate(registered1.token,
          'name1',
          false);
          const channel1 = JSON.parse(String(channelId1.getBody()));
    
        const channelId2 = callingChannelsCreate(registered2.token,
          'name2',
          true);
          const channel2 = JSON.parse(String(channelId2.getBody()));
    
        const result =callingChannelslistAll(registered2.token);
        const result1 = JSON.parse(String(result.getBody()));
        expect(result1).toMatchObject({
          channels: [{
            channelId: channel1.channelId,
            name: 'name1'
          },
          {
            channelId: channel2.channelId,
            name: 'name2'
          }]
        });
    });

    test('Listing 2 channels user created 0', () => {
        callingClear();
        const authUserId1 = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
          const registered1 = JSON.parse(String(authUserId1.getBody()));
    
        const authUserId2 = callingAuthRegister('email2@email.com',
          'password2',
          'First2',
          'Last2');
          const registered2 = JSON.parse(String(authUserId2.getBody()));
    
        const channelId1 = callingChannelsCreate(registered1.token,
          'name1',
          false);
          const channel1 = JSON.parse(String(channelId1.getBody()));
    
        const channelId2 = callingChannelsCreate(registered1.token,
          'name2',
          true);
          const channel2 = JSON.parse(String(channelId2.getBody()));
    
        const result = callingChannelslistAll(registered2.token);
        const result1 = JSON.parse(String(result.getBody()));
        expect(result1).toMatchObject({
          channels: [{
            channelId: channel1.channelId,
            name: 'name1'
          },
          {
            channelId: channel2.channelId,
            name: 'name2'
          }]
        });
      });
    
      test('authUserId Invalid', () => {
        callingClear();
        const authUserId1 = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
          const registered1 = JSON.parse(String(authUserId1.getBody()));

    
        callingChannelsCreate(registered1.token,
          'name1',
          false);
    
        const result = callingChannelslistAll('-99999');
        const result1 = JSON.parse(String(result.getBody()));
        expect(result1).toMatchObject({ channels: [] });
      });
});