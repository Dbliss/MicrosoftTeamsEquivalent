import { clearV1 } from "./other.js";
import { channelsCreateV1, channelsListallV1 } from "./channels.js";
import {channelJoinV1} from "./channel.js"
import { authRegisterV1 } from "./auth.js"

describe('Testing clearV1', () => {
    test('Testing succesfull return of clearV1()', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');

        let uId = authRegisterV1(
            'email1@email.com', 
            'password1', 
            'First1',
            'Last1');
        
        let channel_id = channelsCreateV1(uId.authUserId, 'name', true);
        channelsCreateV1(uId.authUserId, 'name1', true);
        channelJoinV1(authUserId.authUserId, channel_id.channelId);
            
        clearV1();

        let result = channelsListallV1(authUserId.authUserId);

        expect(result).toMatchObject({channels: []});  
    });  
});