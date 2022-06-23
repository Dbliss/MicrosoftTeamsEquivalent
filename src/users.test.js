import { authRegisterV1 } from "./auth";
import { userProfileV1 } from "./users";
import { clearV1 } from "./other.js"
describe('Testing userProfileV1', () => {
    test('Testing successful return of user object from userProfileV1', () => {
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
    
        const result = userProfileV1(authUserId.authUserId,uId.authUserId);
        expect(result).toMatchObject({
            uId: uId.authUserId,
            email: 'email1@email.com',
            nameFirst: 'First1',
            nameLast: 'Last1',
            handleStr: 'first1last1'
        });
    
    });

    test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');

        let uId = -9999;
        const result = userProfileV1(authUserId.authUserId, uId);
        expect(result).toMatchObject({error : 'error'});

    });

    test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
        clearV1();
        let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');

        let uId = authRegisterV1('email1@email.com', 
                                    'password', 
                                    'First1',
                                    'Last1');

        const result = userProfileV1(-9999, uId.authUserId);
        expect(result).toMatchObject({error : 'error'});

    });

});