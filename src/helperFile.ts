import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

function callingClear () {
  const res = request(
    'DELETE',
      `${url}:${port}/clear/v1`
  );
  return res;
}

function callingChannelDetails (token: string, channelId: number) {
  const res = request(
    'GET',
    `${url}:${port}/channel/details/v2`,
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

function callingChannelJoin (token: string, channelId: number) {
  const res = request(
    'POST',
          `${url}:${port}/channel/join/v3`,
          {
            body: JSON.stringify({
              channelId: channelId,
            }),
            headers: {
              token: token,
              'Content-type': 'application/json',
            },
          }
  );
    // expect(res.statusCode).toBe(OK);
  return res;
}

function callingChannelsCreate (token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
        `${url}:${port}/channels/create/v3`,
        {
          body: JSON.stringify({
            name: name,
            isPublic: isPublic
          }),
          headers: {
            token: token,
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

function callingMessageEdit (token: string, messageId: number, message: string) {
  const res = request(
    'PUT',
          `${url}:${port}/message/edit/v1`,
          {
            body: JSON.stringify({
              messageId: messageId,
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

function callingMessageRemove (token: string, messageId: number) {
  const res = request(
    'DELETE',
          `${url}:${port}/message/remove/v1`,
          {
            qs: {
              messageId: messageId,
            },
            headers: {
              token: token,
            }
          }
  );
  return res;
}

function callingChannelMessages (token:string, channelId: number, start: number) {
  const res = request(
    'GET',
        `${url}:${port}/channel/messages/v2`,
        {
          qs: {
            channelId: channelId,
            start: start,
          },
          headers: {
            token: token,
          }
        }
  );
  return res;
}

function callingUserProfile (token: string, uId: number) {
  const res = request(
    'GET',
          `${url}:${port}/user/profile/v2`,
          {
            qs: {
              uId: uId,
            },
            headers: {
              token: token,
            }
          }
  );
  return res;
}

function callingUsersAll (token: string) {
  const res = request(
    'GET',
        `${url}:${port}/users/all/v1`,
        {
          qs: {

          },
          headers: {
            token: token,
          }
        }
  );
  // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserProfileSetName (token: string, nameFirst:string, nameLast:string) {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/setname/v1`,
        {
          body: JSON.stringify({
            nameFirst: nameFirst,
            nameLast: nameLast,
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserProfileSetEmail (token: string, email: string) {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/setemail/v1`,
        {
          body: JSON.stringify({
            email: email,
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  // expect(res.statusCode).toBe(OK);
  return res;
}

function callingUserProfileSetHandle (token: string, handleStr: string) {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/sethandle/v1`,
        {
          body: JSON.stringify({
            handleStr: handleStr,
          }),
          headers: {
            token: token,
            'Content-type': 'application/json',
          },
        }
  );
  // expect(res.statusCode).toBe(OK);
  return res;
}

function callingChannelInvite (token:string, channelId: number, uId: number) {
  const res = request(
    'POST',
            `${url}:${port}/channel/invite/v2`,
            {
              body: JSON.stringify({
                channelId: channelId,
                uId: uId,
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function callingMessageReact(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
            `${url}:${port}/message/react/v1`,
            {
              body: JSON.stringify({
                messageId: messageId,
                reactId: reactId
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function callingMessageUnreact(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
            `${url}:${port}/message/unreact/v1`,
            {
              body: JSON.stringify({
                messageId: messageId,
                reactId: reactId
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function callingNotificationsGet(token: string) {
  const res = request(
    'GET',
            `${url}:${port}/notifications/get/v1`,
            {
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingSearch(token: string, queryStr: string) {
  const res = request(
    'GET',
            `${url}:${port}/search/v1`,
            {
              qs: {
                queryStr: queryStr,
              },
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function requestChannelLeave(token: string, channelId: number) {
  const res = request(
    'POST',
            `${url}:${port}/channel/leave/v3`,
            {
              body: JSON.stringify({
                channelId: channelId
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function requestAddOwner(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
            `${url}:${port}/channel/addowner/v2`,
            {
              body: JSON.stringify({
                channelId: channelId,
                uId: uId
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function requestRemoveOwner(token:string, channelId: number, uId: number) {
  const res = request(
    'POST',
            `${url}:${port}/channel/removeowner/v2`,
            {
              body: JSON.stringify({
                channelId: channelId,
                uId: uId
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
            `${url}:${port}/auth/register/v3`,
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

function requestChannelsCreate(token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
            `${url}:${port}/channels/create/v3`,
            {
              body: JSON.stringify({
                name: name,
                isPublic: isPublic
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function requestChannelInvite(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
            `${url}:${port}/channel/invite/v2`,
            {
              body: JSON.stringify({
                channelId: channelId,
                uId: uId
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function callingChannelslist (token: string) {
  const res = request(
    'GET',
            `${url}:${port}/channels/list/v3`,
            {
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingChannelslistAll (token: string) {
  const res = request(
    'GET',
            `${url}:${port}/channels/listall/v3`,
            {
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingDmCreate(token: string, uIds: number[]) {
  const res = request(
    'POST',
          `${url}:${port}/dm/create/v2`,
          {
            body: JSON.stringify({
              uIds: uIds,
            }),
            headers: {
              token: token,
              'Content-type': 'application/json',
            },
          }
  );
  return res;
}

function callingDmList(token: string) {
  const res = request(
    'GET',
            `${url}:${port}/dm/list/v2`,
            {
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingDmRemove(token: string, dmId: number) {
  const res = request(
    'DELETE',
            `${url}:${port}/dm/remove/v2`,
            {
              qs: {
                dmId: dmId,
              },
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingDmDetails(token: string, dmId: number) {
  const res = request(
    'GET',
            `${url}:${port}/dm/details/v2`,
            {
              qs: {
                dmId: dmId,
              },
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingDmLeave(token: string, dmId: number) {
  const res = request(
    'POST',
            `${url}:${port}/dm/leave/v2`,
            {
              body: JSON.stringify({

                dmId: dmId,
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function callingDmMessages(token: string, dmId: number, start: number) {
  const res = request(
    'GET',
            `${url}:${port}/dm/messages/v2`,
            {
              qs: {
                dmId: dmId,
                start: start,
              },
              headers: {
                token: token,
              }
            }
  );
  return res;
}

function callingMessageSendDm(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
            `${url}:${port}/message/senddm/v2`,
            {
              body: JSON.stringify({

                dmId: dmId,
                message: message,
              }),
              headers: {
                token: token,
                'Content-type': 'application/json',
              },
            }
  );
  return res;
}

function callingAuthRegister (email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
        `${url}:${port}/auth/register/v3`,
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

function callingMessageShare (token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/share/v1`,
        {
          body: JSON.stringify({
            ogMessageId: ogMessageId,
            message: message,
            channelId: channelId,
            dmId: dmId
          }),
          headers: {
            'Content-type': 'application/json',
            token: token,
          },
        }
  );
  return res;
}

function callingMessagePin (token: string, messageId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/pin/v1`,
        {
          body: JSON.stringify({
            messageId: messageId,
          }),
          headers: {
            'Content-type': 'application/json',
            token: token,
          },
        }
  );
  return res;
}

function callingMessageUnpin (token: string, messageId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/unpin/v1`,
        {
          body: JSON.stringify({
            messageId: messageId,
          }),
          headers: {
            'Content-type': 'application/json',
            token: token,
          },
        }
  );
  return res;
}

function callingMessageSendLater (token: string, channelId: number, message: string, timeSent: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/sendlater/v1`,
        {
          body: JSON.stringify({
            channelId: channelId,
            message: message,
            timeSent: timeSent,
          }),
          headers: {
            'Content-type': 'application/json',
            token: token,
          },
        }
  );
  return res;
}

function callingMessageSendLaterDm (token: string, dmId: number, message: string, timeSent: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/sendlaterdm/v1`,
        {
          body: JSON.stringify({
            dmId: dmId,
            message: message,
            timeSent: timeSent,
          }),
          headers: {
            'Content-type': 'application/json',
            token: token,
          },
        }
  );
  return res;
}

export {
  callingAuthRegister,
  callingChannelsCreate,
  callingChannelslist,
  callingChannelslistAll,
  callingChannelDetails,
  callingChannelJoin,
  callingChannelInvite,
  callingChannelMessages,
  callingUserProfile,
  callingClear,
  // callingAuthLogout,
  requestChannelLeave,
  requestAddOwner,
  requestAuthRegister,
  requestRemoveOwner,
  requestChannelInvite,
  requestChannelsCreate,
  callingMessageSend,
  callingMessageEdit,
  callingMessageRemove,
  callingDmCreate,
  callingDmList,
  callingDmRemove,
  callingDmDetails,
  callingDmLeave,
  callingDmMessages,
  callingMessageSendDm,
  callingUsersAll,
  callingUserProfileSetName,
  callingUserProfileSetEmail,
  callingUserProfileSetHandle,
  callingNotificationsGet,
  callingSearch,
  callingMessageShare,
  callingMessageReact,
  callingMessageUnreact,
  callingMessagePin,
  callingMessageUnpin,
  callingMessageSendLater,
  callingMessageSendLaterDm,
  // callingStandupStart,
  // callingStandupActive,
  // callingStandUpSend,
  // callingPasswordResetRequest,
  // callingPasswordResetReset,
  // callingUserProfileUploadPhoto,
  // callingUsersStats,
  // callingAdminUserRemove,
  // callingAdminUserPermissionChange,
};
