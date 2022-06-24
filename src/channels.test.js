// File contains testing for channels.js

// Importing functions from channels.js file
import {
  channelsCreateV1,
  channelsListV1,
  channelsListallV1,
} from './channels.js';

import {
  authRegisterV1,
} from "./auth.js";

import {
  clearV1,
} from './other.js';
import { getData } from './dataStore.js';


describe('Testing channelsCreateV1', () => {
  
  test('Name length < 1', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let result = channelsCreateV1(authUserId.authUserId, '', false);
    expect(result).toMatchObject({error: 'error'});
  });
  
  test('Name length > 20', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let result = channelsCreateV1(authUserId.authUserId, 
                                  'abcdefghijklmnopqrstuv', 
                                  false);

    expect(result).toMatchObject({error: 'error'});
  });
 
  test('Valid parameters', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');

    let result = channelsCreateV1(authUserId.authUserId, 
                                  'name', 
                                  false);

    expect(result).toMatchObject({channelId: expect.any(Number)});
  });

    test('Invalid authUserId', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let result = channelsCreateV1(-9999, 
                                  'name', 
                                  false);

    expect(result).toMatchObject({error: 'error'});
  });
  
 


});



describe('Testing channelsListV1', () => {

  test('Listing 2 channels user is part of', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let channelId1 = channelsCreateV1(authUserId.authUserId, 
                                  'name1', 
                                  false);
                  
    let channelId2 = channelsCreateV1(authUserId.authUserId, 
                                  'name2', 
                                  true);

    let result = channelsListV1(authUserId.authUserId);
    expect(result).toMatchObject({channels: [{
                              channelId: channelId1.channelId,
                              name: 'name1'},
                            {
                              channelId: channelId2.channelId,
                              name: 'name2'}]});
                                  
  });

  test('Listing 1 channel user is part of', () => {
    clearV1();
    let authUserId1 = authRegisterV1('email@email.com', 
                                     'password', 
                                     'First',
                                     'Last');
    
    let authUserId2 = authRegisterV1('email2@email.com', 
                                     'password2', 
                                     'First2',
                                     'Last2');
                         
                                    
    let channelId1 = channelsCreateV1(authUserId1.authUserId, 
                                  'name1', 
                                  false);
                  
    let channelId2 = channelsCreateV1(authUserId2.authUserId, 
                                  'name2', 
                                  true);
    let data = getData();                 
    let result = channelsListV1(authUserId2.authUserId);
    expect(result).toMatchObject({channels: [{
                                  channelId: channelId2.channelId,
                                  name: 'name2'}]});
                                  
  });
  
  test('Listing 0 channels user is not part of any', () => {
    clearV1();
    let authUserId1 = authRegisterV1('email@email.com', 
                                     'password', 
                                     'First',
                                     'Last');
    
    let authUserId2 = authRegisterV1('email2@email.com', 
                                     'password2', 
                                     'First2',
                                     'Last2');
                         
                                    
    let channelId1 = channelsCreateV1(authUserId1.authUserId, 
                                  'name1', 
                                  false);
                  
    let channelId2 = channelsCreateV1(authUserId1.authUserId, 
                                  'name2', 
                                  true);
                                  
    let result = channelsListV1(authUserId2.authUserId);
    expect(result).toMatchObject({channels: []});
                                  
  });
  
  test('authUserId Invalid', () => {
    clearV1();
    let authUserId1 = authRegisterV1('email@email.com', 
                                     'password', 
                                     'First',
                                     'Last');
    
    let channelId1 = channelsCreateV1(authUserId1.authUserId, 
                                  'name1', 
                                  false);
                                  
    let result = channelsListV1(-99999);
    expect(result).toMatchObject({channels: []});
                                  
  });
  
  

});

describe('Testing channelsListallV1', () => {

  test('Listing 2 channels created by user', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let channelId1 = channelsCreateV1(authUserId.authUserId, 
                                  'name1', 
                                  false);
                  
    let channelId2 = channelsCreateV1(authUserId.authUserId, 
                                  'name2', 
                                  true);
                                  
    let result = channelsListallV1(authUserId.authUserId);
    expect(result).toMatchObject({channels: [{
                              channelId: channelId1.channelId,
                              name: 'name1'},
                            {
                              channelId: channelId2.channelId,
                              name: 'name2'}]});
                                  
  });
  
  test('Listing 2 channels user created 1', () => {
    clearV1();
    let authUserId1 = authRegisterV1('email@email.com', 
                                     'password', 
                                     'First',
                                     'Last');
    
    let authUserId2 = authRegisterV1('email2@email.com', 
                                     'password2', 
                                     'First2',
                                     'Last2');
                         
                                    
    let channelId1 = channelsCreateV1(authUserId1.authUserId, 
                                  'name1', 
                                  false);
                  
    let channelId2 = channelsCreateV1(authUserId2.authUserId, 
                                  'name2', 
                                  true);
                                  
    let result = channelsListallV1(authUserId2.authUserId);
    expect(result).toMatchObject({channels: [{
                              channelId: channelId1.channelId,
                              name: 'name1'},
                            {
                              channelId: channelId2.channelId,
                              name: 'name2'}]});
                                  
  });
  
    test('Listing 2 channels user created 0', () => {
    clearV1();
    let authUserId1 = authRegisterV1('email@email.com', 
                                     'password', 
                                     'First',
                                     'Last');
    
    let authUserId2 = authRegisterV1('email2@email.com', 
                                     'password2', 
                                     'First2',
                                     'Last2');
                         
                                    
    let channelId1 = channelsCreateV1(authUserId1.authUserId, 
                                  'name1', 
                                  false);
                  
    let channelId2 = channelsCreateV1(authUserId1.authUserId, 
                                  'name2', 
                                  true);
                                  
    let result = channelsListallV1(authUserId2.authUserId);
    expect(result).toMatchObject({channels: [{
                              channelId: channelId1.channelId,
                              name: 'name1'},
                            {
                              channelId: channelId2.channelId,
                              name: 'name2'}]});
                                  
  });
  
  test('authUserId Invalid', () => {
    clearV1();
    let authUserId1 = authRegisterV1('email@email.com', 
                                     'password', 
                                     'First',
                                     'Last');
    
    let channelId1 = channelsCreateV1(authUserId1.authUserId, 
                                  'name1', 
                                  false);
                                  
    let result = channelsListallV1(-99999);
    expect(result).toMatchObject({channels: []});
                                  
  });
  

});
