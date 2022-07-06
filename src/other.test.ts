import { clearV1 } from './other';
import { channelsCreateV1, channelsListallV1 } from './channels';
import { channelJoinV1 } from './channel';
import { authRegisterV1 } from './auth';

describe('Testing clearV1', () => {
  test('Testing succesfull return of clearV1()', () => {
    clearV1();
    const authUserId = authRegisterV1('email@email.com',
      'password',
      'First',
      'Last');

    const uId = authRegisterV1(
      'email1@email.com',
      'password1',
      'First1',
      'Last1');

    const channelId = channelsCreateV1(uId.authUserId, 'name', true);
    channelsCreateV1(uId.authUserId, 'name1', true);
    channelJoinV1(authUserId.authUserId, channelId.channelId);

    clearV1();

    const result = channelsListallV1(authUserId.authUserId);

    expect(result).toMatchObject({ channels: [] });
  });
});
