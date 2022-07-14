import request from 'sync-request'; 
  // importing other essential functions used in channel
  
  import {
    channelsCreateV1,
  } from './channels';
  
  import {
    authRegisterV1,
  } from './auth';
  
  import {
    clearV1,
  } from './other';
  import { getData, setData } from './dataStore';


  import config from './config.json';
  
  const OK = 200;
  const port = config.port;
  const url = config.url;
  
function callingChannelDetails (token: string, channelId: number) {
    const res = request(
        'GET',
        `${url}:${port}/channel/details/v2`,
        {
            qs: {
                token: token,
                channelId: channelId,
            }
        }
    );
    expect(res.statusCode).toBe(OK);
    return res;
}


function callingChannelJoin (token: string, channelId: number) {
    const res = request(
        'POST',
        `${url}:${port}/channel/join/v2`,
        {
            body: JSON.stringify({
                token: token,
                channelId: channelId,
            }),
            headers: {
                'Content-type': 'application/json',
            },
        }
    );
    expect(res.statusCode).toBe(OK);
    return res;
}

function callingClear () {
    const res = request(
        'DELETE',
        `${url}:${port}/clear/v1`,
        {
            qs: {
                
            }
        }
    );
    expect(res.statusCode).toBe(OK);
    return res;
}

function callingAuthRegister (email:string, password:string, nameFirst:string, nameLast:string) {
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
    expect(res.statusCode).toBe(OK);
    return res;
}

function callingChannelsCreate (token: string, name: string, isPublic: boolean) {
    const res = request(
        'POST',
        `${url}:${port}/channels/create/v2`,
        {
            body: JSON.stringify({
                token: token,
                name: name,
                isPublic: isPublic,
            }),
            headers: {
                'Content-type': 'application/json',
            },
        }
    );
    expect(res.statusCode).toBe(OK);
    return res;
}

// const get = (path, qs) => {
//     const res = request(
//         'GET',
//         `http://localhost:3001/${path}`,
//         {
//             qs: qs
//         }
//     );
//     const bodyObj = JSON.parse(String(res.getBody()));
//     return bodyObj;
// };

// const post = (path, body) => {
//     const res = request(
//         'POST',
//         `http://localhost:3001/${path}`,
//         {
//             body: JSON.stringify(body),
//             headers: {
//                 'Content-type': 'application/json',
//             },
//         }
//     );
//     const bodyObj = JSON.parse(String(res.getBody()));
//     return bodyObj;
// };

describe('HTTP tests for channelDetailsV2', () => {
    test('Testing successful return of channelDetailsV2', () => {
        callingClear();
        const auth = callingAuthRegister(
            'email@email.com',
            'password',
            'First',
            'Last');
            
        const registered = JSON.parse(String(auth.getBody()));
        expect(registered.statusCode).toBe(OK);

        const chanId = callingChannelsCreate(registered.token, 'name', true);
        const channelId = JSON.parse(String(chanId.getBody()));
        expect(channelId.statusCode).toBe(OK);

        const res = callingChannelDetails(registered.token, channelId.channelId);
        const result = JSON.parse(String(res.getBody()));
        expect(result.statusCode).toBe(OK);


        
        expect(result).toMatchObject({
            name: 'name',
            isPublic: true,
            ownerMembers: [{
              uId: registered.authUserId,
              email: 'email@email.com',
              nameFirst: 'First',
              nameLast: 'Last',
              handleStr: 'firstlast',
            }],
            allMembers: [{
              uId: registered.authUserId,
              email: 'email@email.com',
              nameFirst: 'First',
              nameLast: 'Last',
              handleStr: 'firstlast',
            }]
          });        
    });


    test('successful return of channelDetailsV1 with multiple members', () => {
        callingClear();
        const auth =callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
        const authorised = JSON.parse(String(auth.getBody()));
        expect(authorised.statusCode).toBe(OK);
        const auth1 = callingAuthRegister('email1@email.com',
          'password',
          'First1',
          'Last1');
        const authorised1 = JSON.parse(String(auth1.getBody()));
        expect(authorised1.statusCode).toBe(OK);
    
        const chanId = callingChannelsCreate(authorised.authUserId, 'name', true);
        const channelId = JSON.parse(String(chanId.getBody()));
        expect(channelId.statusCode).toBe(OK);
    
        const joined = JSON.parse(String(callingChannelJoin(authorised1.authUserId, channelId.channelId).getBody()));
        expect(joined.statusCode).toBe(OK);

    
        const res = callingChannelDetails(authorised.authUserId, channelId.channelId);
        const result = JSON.parse(String(res.getBody()));
        expect(result.statusCode).toBe(OK);
        expect(result).toMatchObject({
          name: 'name',
          isPublic: true,
          ownerMembers: [{
            uId: authorised.authUserId,
            email: 'email@email.com',
            nameFirst: 'First',
            nameLast: 'Last',
            handleStr: 'firstlast',
          }],
          allMembers: [{
            uId: authorised.authUserId,
            email: 'email@email.com',
            nameFirst: 'First',
            nameLast: 'Last',
            handleStr: 'firstlast',
          },
          {
            uId: authorised1.authUserId,
            email: 'email1@email.com',
            nameFirst: 'First1',
            nameLast: 'Last1',
            handleStr: 'first1last1',
          }]
        });
      });

      test('Testing when the channelId is not valid ', () => {
        callingClear();
        const auth = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
        const authorised = JSON.parse(String(auth.getBody()));
        callingChannelsCreate(authorised.authUserId, 'name', true);
    
        const res = callingChannelDetails(authorised.token, -9999);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });
      });

      test('Testing when the token is not valid ', () => {
        clearV1();
        const auth = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
        const authorised = JSON.parse(String(auth.getBody()));

        const chanId = callingChannelsCreate(authorised.token, 'name', true);
        const channelId = JSON.parse(String(chanId.getBody()));
    
        const res = callingChannelDetails('random', channelId);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });
      });

      test('channelId is valid but authUserId is not a member of the channel', () => {
        callingClear();
        const auth1 = callingAuthRegister('email@email.com',
          'password',
          'First',
          'Last');
        const authorised1 = JSON.parse(String(auth1.getBody()));

        const auth2 = callingAuthRegister('email2@email2.com',
          'password2',
          'First2',
          'Last2');
        const authorised2 = JSON.parse(String(auth2.getBody()));
        
          
        const chanId = callingChannelsCreate(authorised1.authUserId, 'name', true);
        const channelId = JSON.parse(String(chanId.getBody()));

        const res = callingChannelDetails(authorised2.authUserId, channelId.channelId);
        const result = JSON.parse(String(res.getBody()));
        expect(result).toMatchObject({ error: 'error' });
      });
    
  
    
  });


  describe('Testing channelJoinV1', () => {
    test('Person who created the channel tries to join', () => {
      callingClear();
      
      const auth = callingAuthRegister('email@email.com',
        'password',
        'First',
        'Last');
      const authUser = JSON.parse(String(auth.getBody()));
        
      const channelId = JSON.parse(String((callingChannelsCreate(authUser.authUserId, 'name', true)).getBody()));
  
      const result = JSON.parse(String((callingChannelJoin(authUser.authUserId, channelId.channelId)).getBody()));
      
      expect(result).toMatchObject({ error: 'error' });
    });

    test('Person who did not create channel tries to join public channel', () => {
      clearV1();
      const authUser = JSON.parse(String((callingAuthRegister('email@email.com',
        'password',
        'First',
        'Last')).getBody()));
  
      const authUser1 = JSON.parse(String(callingAuthRegister('email1@email.com',
        'password1',
        'First1',
        'Last1'))).getBody();
  
      /*
      const expected: usersType = {
        uId: authUser.authUserId,
        email: 'email@email.com',
        nameFirst: 'First',
        nameLast: 'Last',
        handleStr: 'firstlast',
      };
  
      const expected1: usersType = {
        uId: authUser1.authUserId,
        email: 'email1@email.com',
        nameFirst: 'First1',
        nameLast: 'Last1',
        handleStr: 'first1last1',
      };
      */
      const channelId = JSON.parse(String(callingChannelsCreate(authUser1.authUserId, 'name', true))).getBody();
  
      channelDetailsV1(authUser1.authUserId, channelId.channelId);
      // expect(chDetails['allMembers']).toContainEqual(expected1);
      // expect(chDetails['allMembers']).not.toContainEqual(expected);
  
      const result = JSON.parse(String(callingChannelJoin(authUser.authUserId, channelId.channelId))).getBody();
      // channelDetailsV1(authUser1.authUserId, channelId.channelId);
      // expect(chDetails1['allMembers']).toContainEqual(expected);
      expect(result).toMatchObject({});
    });

    test('Person who did not create channel tries to join private channel', () => {
      callingClear();
      const authUser = JSON.parse(String(callingAuthRegister('email@email.com',
        'password',
        'First',
        'Last'))).getBody();

      const authUser1 = JSON.parse(String(authRegisterV1('email1@email.com',
        'password1',
        'First1',
        'Last1'))).getBody();

      const channelId = JSON.parse(String(channelsCreateV1(authUser.authUserId, 'name', false))).getBody();

      const result = JSON.parse(String(channelJoinV1(authUser1.authUserId, channelId.channelId))).getBody();
      expect(result).toMatchObject({ error: 'error' });
    });

    test('Private channel + global owner', () => {
      callingClear();
      const globalOwner = JSON.parse(String(callingAuthRegister('email@email.com',
        'password',
        'First',
        'Last'))).getBody();
  
      const globalMember = JSON.parse(String(authRegisterV1('email1@email.com',
        'password1',
        'First1',
        'Last1'))).getBody();
  
      const channelId = JSON.parse(String(channelsCreateV1(globalMember.authUserId, 'name', false))).getBody();
  
      const result = JSON.parse(String(channelJoinV1(globalOwner.authUserId, channelId.channelId))).getBody();
      expect(result).toMatchObject({});
    });


  });