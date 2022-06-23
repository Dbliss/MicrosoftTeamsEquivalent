// import { clear } from "node:console";
// import test from "node:test";
import { channelDetailsV1, channelJoinV1 } from "./channel.js";
import { authRegisterV1 } from "./auth.js";
import { channelsCreateV1 } from "./channels.js";
import { clearV1 } from "./other.js"

describe('Testing channelDetailsV1', () => {
    test('Testing successful return of channelDetailsV1', () => {
        clearV1();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let channelId = channelsCreateV1(auth_user, 'name', true);

        const result = channelDetailsV1(auth_user, channelId);
        expect(result).toMatchObject({name: 'name',
                                    isPublic: true,
                                    ownerMembers: [{
                                        uID: auth_user,
                                        email: 'email@email.com',
                                        nameFirst: 'First',
                                        nameLast: 'Last',
                                        handleStr: 'firstlast'
                                    }],
                                    allMembers: [{
                                        uID: auth_user,
                                        email: 'email@email.com',
                                        nameFirst: 'First',
                                        nameLast: 'Last',
                                        handleStr: 'firstlast'
                                    }]})

    });

    test('Testing when the channelId is not valid ', () => {
        clearV1();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let channelId = -9999;

        const result = channelDetailsV1(auth_user, channelId);
        expect(result).toMatchObject({error: 'error'});

    });

    test('channelId is valid but authUserId is not a member of the channel', () => {
        clearV1();
        let auth_user1 = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let auth_user2 = authRegisterV1('email2@email2.com', 
        'password2', 
        'First2',
        'Last2');

        let channelId = channelsCreateV1(auth_user1, 'name', true);

        const result = channelDetailsV1(auth_user2, channelId);
        expect(result).toMatchObject({error: 'error'});

    });

    
});

describe('Testing channelJoinV1', () => {
    test('Person who created the channel tries to join', () => {
        clearV1();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let channelId = channelsCreateV1(auth_user, 'name', true);

        const result = channelJoinV1(auth_user,channelId);
        expect(result).toMatchObject({error: 'error'})

    });

    test('Person who did not create channel tries to join public channel', () => {
        clearV1();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let auth_user1 = authRegisterV1('email1@email.com', 
        'password1', 
        'First1',
        'Last1');

        let channelId = channelsCreateV1(auth_user1, 'name', true);

        const result = channelJoinV1(auth_user,channelId);
        expect(result).toMatchObject({})

    });

    test('Person who did not create channel tries to join private channel', () => {
        clearV1();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let auth_user1 = authRegisterV1('email1@email.com', 
        'password1', 
        'First1',
        'Last1');

        let channelId = channelsCreateV1(auth_user1, 'name', false);

        const result = channelJoinV1(auth_user,channelId);
        expect(result).toMatchObject({error: 'error'})

    });
    
});