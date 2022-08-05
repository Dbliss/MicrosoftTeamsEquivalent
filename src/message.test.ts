import { callingDmCreate, callingMessageSendDm, callingDmMessages, callingClear, callingChannelInvite, callingChannelsCreate, callingAuthRegister, callingMessageSend, callingMessageRemove, callingMessageEdit, callingChannelMessages } from './helperFile';

const OK = 200;

describe('Testing messageSend', () => {
  test('channelId does not refer to a valid channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, -31231451, 'yeayeysayea');
    expect(res3.statusCode).toBe(400);
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
    expect(res3.statusCode).toBe(400);
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
    expect(res4.statusCode).toBe(403);
  });

  test('invalid token test', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    expect(res1.statusCode).toBe(OK);
    const user1 = JSON.parse(res1.body as string);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSend('-99999', channel1.channelId, 'heaqaewqeuhq');
    expect(res3.statusCode).toBe(400);
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
    const message1 = JSON.parse(String(res3.getBody()));

    expect(message1).toEqual({ messageId: expect.any(Number) });
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
    expect(res4.statusCode).toBe(400);
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
    expect(res4.statusCode).toBe(400);
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
    expect(res4.statusCode).toBe(403);
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

    expect(edit1).toEqual({});

    const res5 = callingChannelMessages(user1.token, channel1.channelId, 0);
    const messages = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    expect(messages).toEqual({ messages: [{ message: 'dsfwe2131wef', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('invalid token inputted', () => {
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

    const res7 = callingMessageSend(user1.token, channel1.channelId, 'abc');
    expect(res7.statusCode).toBe(OK);

    const res4 = callingMessageEdit('-99999', message1.messageId, '');
    expect(res4.statusCode).toBe(400);
  });

  test('not a owner of dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res2 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res2.statusCode).toBe(OK);
    const dm1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageEdit(user2.token, message1.messageId, 'cba');
    expect(res4.statusCode).toBe(403);
  });

  test('is not owner of channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res7 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res7.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageEdit(user2.token, message1.messageId, '');
    expect(res4.statusCode).toBe(403);
  });

  test('succesful deletion via edit for a message', () => {
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

    const res7 = callingMessageSend(user1.token, channel1.channelId, 'abc');
    const message2 = JSON.parse(res7.body as string);
    expect(res7.statusCode).toBe(OK);

    const res4 = callingMessageEdit(user1.token, message1.messageId, '');
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    const res5 = callingChannelMessages(user1.token, channel1.channelId, 0);
    const messages = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    expect(edit1).toEqual({});

    expect(messages).toEqual({ messages: [{ message: 'abc', messageId: message2.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('succesful edit for a message 2', () => {
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

    const res7 = callingMessageSend(user1.token, channel1.channelId, 'abc');
    const message = JSON.parse(res7.body as string);
    expect(res7.statusCode).toBe(OK);

    const res4 = callingMessageEdit(user1.token, message1.messageId, 'cba');
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    const res5 = callingChannelMessages(user1.token, channel1.channelId, 0);
    const messages = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    expect(edit1).toEqual({});

    expect(messages).toEqual({ messages: [{ message: 'cba', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }, { message: 'abc', messageId: message.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('succesful edit for a message in a dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res2 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res2.statusCode).toBe(OK);
    const dm1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res7 = callingMessageSendDm(user1.token, dm1.dmId, 'abc');
    const message = JSON.parse(res7.body as string);
    expect(res7.statusCode).toBe(OK);

    const res4 = callingMessageEdit(user1.token, message1.messageId, 'cba');
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    const res5 = callingDmMessages(user1.token, dm1.dmId, 0);
    const messages = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    expect(edit1).toEqual({});

    expect(messages).toEqual({ messages: [{ message: 'abc', messageId: message.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }, { message: 'cba', messageId: message1.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('succesful edit for a message in a dm 2', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res2 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res2.statusCode).toBe(OK);
    const dm1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res7 = callingMessageSendDm(user1.token, dm1.dmId, 'abc');
    expect(res7.statusCode).toBe(OK);
    const message2 = JSON.parse(res7.body as string);

    const res4 = callingMessageEdit(user1.token, message1.messageId, '');
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    const res5 = callingDmMessages(user1.token, dm1.dmId, 0);
    const messages = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    expect(edit1).toEqual({});

    expect(messages).toEqual({ messages: [{ message: 'abc', messageId: message2.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
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
    expect(res4.statusCode).toBe(400);
  });

  test('the message was not sent by the authorised user making this request or the authorised user does not have owner permissions in the channel', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email@gmail.com', 'password1', 'first1', 'last1');
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
    expect(res4.statusCode).toBe(403);
  });

  test('invalid token test', () => {
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

    const res4 = callingMessageRemove('-99999', message1.messageId);
    expect(res4.statusCode).toBe(400);
  });

  test('apart of channel but not owner in it', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res2 = callingChannelsCreate(user1.token, 'channel1', true);
    expect(res2.statusCode).toBe(OK);
    const channel1 = JSON.parse(res2.body as string);

    const res6 = callingChannelInvite(user1.token, channel1.channelId, user2.authUserId);
    expect(res6.statusCode).toBe(OK);

    const res3 = callingMessageSend(user1.token, channel1.channelId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res4 = callingMessageRemove(user2.token, message1.messageId);
    expect(res4.statusCode).toBe(403);
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

    const res6 = callingMessageSend(user1.token, channel1.channelId, 'abc');
    expect(res6.statusCode).toBe(OK);
    const message2 = JSON.parse(res6.body as string);

    const res4 = callingMessageRemove(user1.token, message1.messageId);
    const removed = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    expect(removed).toEqual({});

    const res5 = callingChannelMessages(user1.token, channel1.channelId, 0);
    const messages = JSON.parse(res5.body as string);
    expect(res5.statusCode).toBe(OK);

    expect(messages).toEqual({ messages: [{ message: 'abc', messageId: message2.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('succesful deletion of a message in a dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res2 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res2.statusCode).toBe(OK);
    const dm1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res7 = callingMessageSendDm(user1.token, dm1.dmId, 'abc');
    expect(res7.statusCode).toBe(OK);
    const message2 = JSON.parse(res7.body as string);

    const res4 = callingMessageRemove(user1.token, message1.messageId);
    const edit1 = JSON.parse(res4.body as string);
    expect(res4.statusCode).toBe(OK);

    const res5 = callingDmMessages(user1.token, dm1.dmId, 0);
    expect(res5.statusCode).toBe(OK);
    const messages = JSON.parse(res5.body as string);

    expect(edit1).toEqual({});

    expect(messages).toEqual({ messages: [{ message: 'abc', messageId: message2.messageId, timeSent: expect.any(Number), uId: expect.any(Number), reacts: [], isPinned: false }], start: 0, end: -1 });
  });

  test('user is not in dm', () => {
    const res = callingClear();
    expect(res.statusCode).toBe(OK);

    const res1 = callingAuthRegister('email1@gmail.com', 'password1', 'first1', 'last1');
    const user1 = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(OK);

    const res8 = callingAuthRegister('email2@gmail.com', 'password2', 'first2', 'last2');
    const user2 = JSON.parse(res8.body as string);
    expect(res8.statusCode).toBe(OK);

    const res9 = callingAuthRegister('email232@gmail.com', 'password212', 'first122', 'last312');
    const user3 = JSON.parse(res9.body as string);
    expect(res9.statusCode).toBe(OK);

    const res2 = callingDmCreate(user1.token, [user2.authUserId]);
    expect(res2.statusCode).toBe(OK);
    const dm1 = JSON.parse(res2.body as string);

    const res3 = callingMessageSendDm(user1.token, dm1.dmId, 'dsfwefwef');
    expect(res3.statusCode).toBe(OK);
    const message1 = JSON.parse(res3.body as string);

    const res7 = callingMessageSendDm(user1.token, dm1.dmId, 'abc');
    expect(res7.statusCode).toBe(OK);

    const res4 = callingMessageRemove(user3.token, message1.messageId);
    expect(res4.statusCode).toBe(403);
  });
});

describe('Testing messageSendDm', () => {
  test('Invalid Token', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingMessageSendDm('-9999', dm1.dmId, 'Hello Message');
    expect(res.statusCode).toBe(403);
  });

  test('Invalid dmId', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);

    const res = callingMessageSendDm(registered1.token, -9999, 'Hello Message');
    expect(res.statusCode).toBe(400);
  });

  test('Message < 1 character', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingMessageSendDm(registered1.token, dm1.dmId, '');
    expect(res.statusCode).toBe(400);
  });

  test('Message > 1000 characters', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    let message = '';
    for (let i = 0; i <= 1001; i++) {
      message = message + i;
    }
    const res = callingMessageSendDm(registered1.token, dm1.dmId, message);
    expect(res.statusCode).toBe(400);
  });

  test('User is not part of dm', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const auth3 = callingAuthRegister('email3@email.com',
      'password3',
      'First3',
      'Last3');
    const registered3 = JSON.parse(String(auth3.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingMessageSendDm(registered3.token, dm1.dmId, 'Hello Message');
    expect(res.statusCode).toBe(403);
  });

  test('Valid Parameters', () => {
    callingClear();
    const auth1 = callingAuthRegister('email@email.com',
      'password',
      'First',
      'Last');
    const registered1 = JSON.parse(String(auth1.getBody()));

    const auth2 = callingAuthRegister('email2@email.com',
      'password2',
      'First2',
      'Last2');
    const registered2 = JSON.parse(String(auth2.getBody()));

    const dm = callingDmCreate(registered1.token, [registered2.authUserId]);
    expect(dm.statusCode).toBe(OK);
    const dm1 = JSON.parse(String(dm.getBody()));

    const res = callingMessageSendDm(registered1.token, dm1.dmId, 'Hello Message');
    const result = JSON.parse(String(res.getBody()));
    expect(result).toMatchObject({ messageId: expect.any(Number) });
  });
});
