// File contains testing for channels.js

// Importing functions from channels.js file
import {
  channelsCreateV1,
  channelsListV1,
  channelsListallV1,
} from './channels.js';

import {
  clearV1;
} from './other.js'


describe('Testing channelsCreateV1', () => {
  
  test('Name length < 1', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let result = channelsCreateV1(authUserId, '', false);
    expect(result).toMatchObject({error: 'error'});
  });
  
  test('Name length > 20', () => {
    clearV1();
    let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');
                                    
    let result = channelsCreateV1(authUserId, 
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
                                    
    let result = channelsCreateV1(authUserId, 
                                  'name', 
                                  false);

    expect(result).any(Number));
  });
  
  


});

describe('Testing channelsListV1', () => {

  test('', () => {
    clearV1();
  });

});

describe('Testing channelsListallV1', () => {

  test('', () => {
    clearV1();
  });

});

