import { clear } from "node:console";
import test from "node:test";
import { channelDetailsV1, channelJoinV1 } from "./channel";
import { authRegisterV1, authLoginV1} from "./auth";
import {channelsCreateV1} from "./channels";

describe('Testing channelDetailsV1', () => {
    test('Testing successful return of channelDetailsV1', () => {
        clear();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let channelId = channelsCreateV1(auth_user, 'name', true);

        const result = channelDetailsV1(auth_user, channelId);
        expect(result).toMatchObject({name: 'name',
                                    isPublic: true,
                                    ownerMembers: [auth_user = {}],
                                    allMembers: [auth_user = {}]})

    });

    test('Testing when the channelId is not valid ', () => {
        clear();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let channelId = -9999;

        const result = channelDetailsV1(auth_user, channelId);
        expect(result).toMatchObject({error: 'error'});

    });

    test('Testing when the channelId is valid but authUserId is not a member of the channel ', () => {
        clear();
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
        clear();
        let auth_user = authRegisterV1('email@email.com', 
        'password', 
        'First',
        'Last');

        let channelId = channelsCreateV1(auth_user, 'name', true);

        const result = channelJoinV1(auth_user,channelId);
        expect(result).toMatchObject({error: 'error'})

    });

    test('Person who did not create channel tries to join public channel', () => {
        clear();
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
        clear();
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