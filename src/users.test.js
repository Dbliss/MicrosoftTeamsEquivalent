import { authRegisterV1 } from "./auth";
import { userProfileV1 } from "./users";

describe('userProfileV1', () => {
    test('Testing error return of userProfileV1 when the uId does not refer to a valid user', () => {
        clear();
        let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');

        let uId = -9999;
        const result = userProfileV1(authUserId, uId);
        expect(result).toMatchObject({error : 'error'});

    });

    test('Testing successful return of user object from userProfileV1', () => {
        clear();
        let authUserId = authRegisterV1('email@email.com', 
                                    'password', 
                                    'First',
                                    'Last');

        let uId = authRegisterV1(
            'email1@email.com', 
            'password', 
            'First1',
            'Last1');

        const result = userProfileV1(authUserId,uId);
        expect(result).toMatchObject(user = {
            uId: uId,
            email: 'email1@email.com',
            nameFirst: 'First1',
            nameLast: 'Last1',
            handleStr: 'some_string'
        });

    });
});