// Importing the functions from channel.js file

import {
    channelDetailsV1,
    channelJoinV1,
    channelInviteV1,
    channelMessagesV1, 
} from '.channel.js';

// importing other essential functions used in channel

import {
    channelsCreateV1,
  } from './channels.js';
  

import {
    authRegisterV1,
  } from "auth.js";
  
  import {
    clearV1,
  } from './other.js';
  


  describe('Testing channelInvite1', () => {
  
    test('channelId does not refer to a valid channel', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                      'password', 
                                      'First',
                                      'Last');
       
        let uId = authRegisterV1('email2@email.com', 
                                      'password2', 
                                      'First2',
                                      'Last2');
                                      
        let result = channelInviteV1(authUserId, 1, uId);
        
        expect(result).toMatchObject({error: 'error'});
    });
    
    test('Uid refers to a user who is already a member of the channel', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                      'password', 
                                      'First',
                                      'Last');
       
        let channelId = channelsCreateV1(authUserId, 'name', false);
                                      
        let result = channelInviteV1(authUserId, channelId, authUserId);
        
        expect(result).toMatchObject({error: 'error'});
    });
    
    test('ChannelId is valid and the authorised user is not a member of the channel', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                      'password', 
                                      'First',
                                      'Last');
       
        let authUserId2 = authRegisterV1('email2@email.com', 
                                      'password2', 
                                      'First2',
                                      'Last2');
         
        let uId = authRegisterV1('email3@email.com', 
                                      'password3', 
                                      'First3',
                                      'Last3');
        let channelId = channelsCreateV1(authUserId, 'name', false);
                                      
        let result = channelInviteV1(authUserId2, channelId, uId);
        
        expect(result).toMatchObject({error: 'error'});
    });
    
    test('no errors', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                      'password', 
                                      'First',
                                      'Last');
         
        let uId = authRegisterV1('email3@email.com', 
                                      'password3', 
                                      'First3',
                                      'Last3');
        let channelId = channelsCreateV1(authUserId, 'name', false);
                                      
        let result = channelInviteV1(authUserId, channelId, uId);
        
        expect(result).toMatchObject({});
    });
    
  
  
  });
  