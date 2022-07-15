import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

function callingClear () {
  const res = request(
    'DELETE',
  `${url}:${port}/clear/V1`);
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
            isPublic: isPublic
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingAuthRegister (email: string, password: string, nameFirst: string, nameLast: string) {
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
  return res;
}

function callingMessageSend (token: string, channelId: number, message: string) {
  const res = request(
    'POST',
          `${url}:${port}/message/send/v1`,
          {
            body: JSON.stringify({
              token: token,
              channelId: channelId,
              message: message
            }),
            headers: {
              'Content-type': 'application/json',
            },
          }
  );
  return res;
}

function callingMessageEdit (token: string, messageId: number, message: string) {
  const res = request(
    'PUT',
          `${url}:${port}/message/edit/v1`,
          {
            body: JSON.stringify({
              token: token,
              messageId: messageId,
              message: message
            }),
            headers: {
              'Content-type': 'application/json',
            },
          }
  );
  return res;
}

function callingMessageRemove (token: string, messageId: number) {
  const res = request(
    'DELETE',
          `${url}:${port}/message/remove/v1`,
          {
            qs: {
              token: token,
              messageId: messageId,
            }
          }
  );
  return res;
}

describe('Testing messageSend', () => {
  test('channelId does not refer to a valid channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, -31231451, 'yeayeysayea');
    const message1 = JSON.parse(res3.body as string);
    expect(res3.statusCode).toBe(OK);

    expect(message1).toMatchObject({ error: 'error' });
  });

  test('length of message is less than 1 or over 1000 characters', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, '');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    expect(message1).toMatchObject({ error: 'error' });
  });

  test('channelId is valid and the authorised user is not a member of the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    expect(res1.statusCode).toBe(OK);
    const user2 = JSON.parse(res2.body as string);

    const res3 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res3.statusCode).toBe(OK);
    const channel1 = JSON.parse(res3.body as string);

    const res4 = callingMessageSend(user2.token, channel1.channelId, 'qeqweqdq');
    expect(res4.statusCode).toBe(OK);
    const message1 = JSON.parse(res4.body as string);

    expect(message1).toMatchObject({ error: 'error' });
  });

  test('no errors, succesful message sent', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    expect(message1).toMatchObject({ messageId: expect.any(Number) });
  });
});

describe('Testing messageEdit', () => {
  test('messageId does not refer to a valid message within a channel that the authorised user has joined', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);

    const res4 = callingMessageEdit(user1.token, -321312321, 'qweqewqqd');
    expect(res4.statusCode).toBe(OK);
    const edit1 = JSON.parse(res4.body as string);

    expect(edit1).toMatchObject({ error: 'error' });
  });

  test('length of message is over 1000 characters', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageEdit(user1.token, message1.messageId, '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128268066130032342448111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692268066130034603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903601133053052680661300488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381 83011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405130005681271 452635608277857713427577896091736371787214684409022495343014654958537050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198dsfwefwef268066130026806613002680661300268066130026806613002680661300268066130026806613002680661300');
    expect(res4.statusCode).toBe(OK);
    const edit1 = JSON.parse(res4.body as string);

    expect(edit1).toMatchObject({ error: 'error' });
  });

  test('the message was not sent by the authorised user making this request or the authorised user does not have owner permissions', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res5 = callingAuthRegister('email5@gmail.com', 'password5', 'first5', 'last5');
    const user2 = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageEdit(user2.token, message1.messageId, 'd321312efwef');
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    expect(edit1).toMatchObject({ error: 'error' });
  });

  test('succesful edit of message', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageEdit(user1.token, message1.messageId, 'dsfwe2131wef');
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    expect(edit1).toMatchObject({});
  });
});

describe('Testing messageRemove', () => {
  test('messageId does not refer to a valid message within a channel that the authorised user has joined', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);

    const res4 = callingMessageRemove(user1.token, -32141421);
    const bodyObj4 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    expect(bodyObj4).toMatchObject({ error: 'error' });
  });

  test('the message was not sent by the authorised user making this request or the authorised user does not have owner permissions in the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res5 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user2 = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageRemove(user2.token, message1.messageId);
    const removed = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    expect(removed).toMatchObject({ error: 'error' });
  });

  test('succesful deletion of message', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageRemove(user1.token, message1.messageId);
    const removed = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    expect(removed).toMatchObject({});
  });
});
