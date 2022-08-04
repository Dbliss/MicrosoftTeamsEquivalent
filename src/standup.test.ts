// Importing functions from channels.js file
import request from 'sync-request';
import config from './config.json';
import { callingChannelsCreate, callingClear } from './channelsServer.test';
import { callingAuthRegister } from './dm.test';
import { callingChannelMessages } from './helperFile';

const OK = 200;
const url = config.url;
const port = config.port;
const FORBID = 403;
const BADREQ = 400;

function callingStandupStart (token: string, channelId: number, length: number) {
  const res = request(
    'POST',
        `${url}:${port}/standup/start/v1`,
        {
          body: JSON.stringify({
            channelId: channelId,
            length: length
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  return res;
}

function callingStandupActive (token: string, channelId: number) {
  const res = request(
    'GET',
            `${url}:${port}/standup/active/v1`,
            {
              qs: {
                channelId: channelId,
              },
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingStandupSend (token: string, channelId: number, message: string) {
  const res = request(
    'POST',
            `${url}:${port}/standup/send/v1`,
            {
              body: JSON.stringify({
                channelId: channelId,
                message: message
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

describe('Testing standup/active/v1', () => {
  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      '',
      created.channelId,
      6
    );
    expect(start.statusCode).toBe(FORBID);
  });
  test('Invalid channelId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const start = callingStandupStart(
      member.token,
      -1,
      6
    );
    expect(start.statusCode).toBe(BADREQ);
  });
  test('Length is a negative number', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      -1
    );
    expect(start.statusCode).toBe(BADREQ);
  });
  test('Active standup running currently running', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      1000
    );
    expect(start.statusCode).toBe(OK);
    const start1 = callingStandupStart(
      member.token,
      created.channelId,
      10
    );
    expect(start1.statusCode).toBe(BADREQ);
  });
  test('channelId is valid and user not member of channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const owner = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      owner.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const auth1 = callingAuthRegister(
      'email1@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth1.statusCode).toBe(OK);
    const member = JSON.parse(String(auth1.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      10
    );
    expect(start.statusCode).toBe(FORBID);
  });
  test('Success', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      6
    );
    expect(start.statusCode).toBe(OK);
    const started = JSON.parse(String(start.getBody()));
    console.log(started);
    expect(started).toMatchObject({ timeFinish: expect.any(Number) });
  });
});

describe('testing standup/active/v1', () => {
  test('Success + standup active', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      10
    );
    expect(start.statusCode).toBe(OK);
    const active = callingStandupActive(
      member.token,
      created.channelId
    );
    expect(active.statusCode).toBe(OK);
    const activated = JSON.parse(String(active.getBody()));
    expect(activated).toMatchObject({ isActive: true, timeFinish: expect.any(Number) });
  });
  test('Success + no standup is active', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const active = callingStandupActive(
      member.token,
      created.channelId
    );
    expect(active.statusCode).toBe(OK);
    const activated = JSON.parse(String(active.getBody()));
    expect(activated).toMatchObject({ isActive: false, timeFinish: null });
  });
  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const active = callingStandupActive(
      '',
      created.channelId
    );
    expect(active.statusCode).toBe(FORBID);
  });
  test('Invalid channelId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const active = callingStandupActive(
      member.token,
      -1
    );
    expect(active.statusCode).toBe(BADREQ);
  });
  test('channelId valid but user not in channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const auth1 = callingAuthRegister(
      'email1@email.com',
      'password',
      'first1',
      'last1'
    );
    const nonmember = JSON.parse(String(auth1.getBody()));
    const active = callingStandupActive(
      nonmember.token,
      created.channelId
    );
    expect(active.statusCode).toBe(FORBID);
  });
});

describe('testing standup/send/v1', () => {
  test('success', async() => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      1
    );
    expect(start.statusCode).toBe(OK);
    const send = callingStandupSend(
      member.token,
      created.channelId,
      'Hello World'
    );
    expect(send.statusCode).toBe(OK);
    const sent = JSON.parse(String(send.getBody()));
    expect(sent).toStrictEqual({});
    const send1 = callingStandupSend(
      member.token,
      created.channelId,
      'Can you see this?'
    );
    expect(send1.statusCode).toBe(OK);
    const sent2 = JSON.parse(String(send1.getBody()));
    expect(sent2).toStrictEqual({});
    await new Promise((r) => setTimeout(r, 2000));
    const chmsgs = callingChannelMessages(
      member.token,
      created.channelId,
      0
    );
    expect(chmsgs.statusCode).toBe(OK);
    const reveal = JSON.parse(String(chmsgs.getBody()));
    console.log(reveal);
  });
  test('Invalid token', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const send = callingStandupSend(
      '',
      created.channelId,
      'Hello World'
    );
    expect(send.statusCode).toBe(FORBID);
  });
  test('Invalid channelId', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const send = callingStandupSend(
      member.token,
      -1,
      'Hello World'
    );
    expect(send.statusCode).toBe(BADREQ);
  });
  test('Message length over 1000 characters', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const send = callingStandupSend(
      member.token,
      created.channelId,
      '141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128268066130032342448111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692268066130034603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903601133053052680661300488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381 83011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405130005681271 452635608277857713427577896091736371787214684409022495343014654958537050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198dsfwefwef268066130026806613002680661300268066130026806613002680661300268066130026806613002680661300'
    );
    expect(send.statusCode).toBe(BADREQ);
  });
  test('Active standup not running', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const send = callingStandupSend(
      member.token,
      created.channelId,
      'Hello World'
    );
    expect(send.statusCode).toBe(BADREQ);
  });
  test('channelId valid but user not a member of channel', () => {
    expect(callingClear().statusCode).toBe(OK);
    const auth = callingAuthRegister(
      'email@email.com',
      'password',
      'first',
      'last'
    );
    expect(auth.statusCode).toBe(OK);
    const member = JSON.parse(String(auth.getBody()));
    const create = callingChannelsCreate(
      member.token,
      'name',
      true
    );
    expect(create.statusCode).toBe(OK);
    const created = JSON.parse(String(create.getBody()));
    const start = callingStandupStart(
      member.token,
      created.channelId,
      50
    );
    expect(start.statusCode).toBe(OK);
    const auth1 = callingAuthRegister(
      'email1@email.com',
      'password',
      'first1',
      'last1'
    );
    const nonmember = JSON.parse(String(auth1.getBody()));
    const send = callingStandupSend(
      nonmember.token,
      created.channelId,
      'Hello World'
    );
    expect(send.statusCode).toBe(FORBID);
  });
});
