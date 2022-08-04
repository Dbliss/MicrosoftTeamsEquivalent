import express from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import errorHandler from 'middleware-http-errors';

import { authLoginV1, authRegisterV1, authLogoutV1, authPasswordRequestV1, authPasswordResetV1 } from './auth';
import { channelInviteV2, channelMessagesV2 } from './channel';
import { clearV1 } from './other';

import { channelDetailsV1, channelJoinV1 } from './channel';
import { usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1, userProfileV1, userStats, usersStats, userUploadPhoto } from './users';

import {
  channelsCreateV3,
  channelsListV3,
  channelsListallV3,
} from './channels';

import {

  dmCreate,
  dmList,
  dmRemove,
  dmDetails,
  dmLeave,
  dmMessages,
} from './dm';

import {
  channelLeaveV1,
  channelAddOwnerV1,
  channelRemoveOwnerV1,
} from './channel';

import {
  messageSendV1,
  messageEditV1,
  messageRemoveV1,
  messageSenddmV2,
} from './message';
import { getNotifications } from './notifications';
import { adminPermissionChange, adminUserRemove } from './admin';
import { search } from './search';
import { messageReact, messageUnreact } from './messageReact';

// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors
app.use(morgan('dev'));

// Example get request
app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

app.post('/auth/register/v3', (req, res, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    return res.json(authRegisterV1(email, password, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/login/v3', (req, res, next) => {
  try {
    const { email, password } = req.body;
    return res.json(authLoginV1(email, password));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/invite/v2', (req, res, next) => {
  try {
    const { channelId, uId } = req.body;
    return res.json(channelInviteV2(req.headers.token as string, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/messages/v2', (req, res, next) => {
  try {
    const token = req.query.token as string;
    const channelId = req.query.channelId;
    const start = req.query.start;
    return res.json(channelMessagesV2(token, Number(channelId), Number(start)));
  } catch (err) {
    next(err);
  }
});

app.delete('/clear/v1', (req, res, next) => {
  try {
    return res.json(clearV1());
  } catch (err) {
    next(err);
  }
});

app.post('/channels/create/v3', (req, res) => {
  const { name, isPublic } = req.body;
  const token = req.headers.token;
  const cId = channelsCreateV3(token as string, name, isPublic);
  res.json(cId);
});

app.get('/channels/list/v3', (req, res) => {
  const channel = channelsListV3(req.headers.token as string);
  res.json(channel);
});

app.get('/channels/listall/v3', (req, res) => {
  const channel = channelsListallV3(req.headers.token as string);
  res.json(channel);
});

app.post('/auth/logout/v2', (req, res, next) => {
  try {
    const { token } = req.body;
    return res.json(authLogoutV1(token));
  } catch (err) {
    next(err);
  }
});

// WRAPPING CHANNEL FUNCTIONS - channelDetailsV1 (GET) and channelJoinV1 (POST)

app.get('/channel/details/v2', (req, res, next) => {
  try {
    const channelId = req.query.channelId as string;
    return res.json(channelDetailsV1((req.headers.token as string), parseInt(channelId)));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/join/v3', (req, res, next) => {
  try {
    const { channelId } = req.body;
    return res.json(channelJoinV1(String(req.headers.token), channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/create/v2', (req, res) => {
  const uIds = req.body.uIds;
  const token = req.headers.token;
  const dmId = dmCreate(token as string, uIds);
  res.json(dmId);
});

app.get('/dm/list/v2', (req, res) => {
  const dms = dmList(req.headers.token as string);
  res.json(dms);
});

app.delete('/dm/remove/v2', (req, res) => {
  const remove = dmRemove(req.headers.token as string, parseInt(req.query.dmId as string));
  res.json(remove);
});

app.get('/dm/details/v2', (req, res) => {
  const dms = dmDetails(req.headers.token as string, parseInt(req.query.dmId as string));
  res.json(dms);
});

app.post('/dm/leave/v2', (req, res) => {
  const dmId = req.body.dmId;
  const token = req.headers.token;
  const leave = dmLeave(token as string, dmId);
  res.json(leave);
});

app.get('/dm/messages/v2', (req, res) => {
  const messages = dmMessages(req.headers.token as string, parseInt(req.query.dmId as string), parseInt(req.query.start as string));
  res.json(messages);
});

app.post('/channel/leave/v3', (req, res, next) => {
  try {
    const { channelId } = req.body;
    return res.json(channelLeaveV1(req.headers.token as string, channelId));
  } catch (err) {
    next(err);
  }
});

app.get('/user/profile/v2', (req, res, next) => {
  try {
    const token = String(req.headers.token);
    const uId = req.query.uId;
    return res.json(userProfileV1(String(token), Number(uId)));
  } catch (err) {
    next(err);
  }
});
app.post('/message/send/v1', (req, res, next) => {
  try {
    const { token, channelId, message } = req.body;
    return res.json(messageSendV1(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.get('/users/all/v1', (req, res, next) => {
  try {
    const token = String(req.headers.token);
    return res.json(usersAllV1(String(token)));
  } catch (err) {
    next(err);
  }
});
app.post('/channel/addowner/v2', (req, res, next) => {
  try {
    const { channelId, uId } = req.body;
    return res.json(channelAddOwnerV1(req.headers.token as string, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setname/v1', (req, res, next) => {
  try {
    const { nameFirst, nameLast } = req.body;

    return res.json(userProfileSetNameV1(String(req.headers.token), nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.put('/message/edit/v1', (req, res, next) => {
  try {
    const { token, messageId, message } = req.body;
    res.json(messageEditV1(token, messageId, message));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setemail/v1', (req, res, next) => {
  try {
    const { email } = req.body;
    return res.json(userProfileSetEmailV1(String(req.headers.token), email));
  } catch (err) {
    next(err);
  }
});
app.post('/channel/removeowner/v2', (req, res, next) => {
  try {
    const { channelId, uId } = req.body;
    return res.json(channelRemoveOwnerV1(req.headers.token as string, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/sethandle/v1', (req, res, next) => {
  try {
    const { handleStr } = req.body;
    return res.json(userProfileSetHandleV1(String(req.headers.token), handleStr));
  } catch (err) {
    next(err);
  }
});

app.delete('/message/remove/v1', (req, res, next) => {
  const token = req.query.token as string;
  const messageId = parseInt(req.query.messageId as string);
  const remove = messageRemoveV1(token, messageId);
  res.json(remove);
});

app.post('/message/senddm/v2', (req, res) => {
  const { dmId, message } = req.body;
  const token = req.headers.token;
  const leave = messageSenddmV2(token as string, dmId, message);
  res.json(leave);
});

app.get('/notifications/get/v1', (req, res) => {
  const notifications = getNotifications(req.headers.token as string);
  res.json(notifications);
});

app.delete('/admin/user/remove/v1', (req, res) => {
  const remove = adminUserRemove(req.headers.token as string, Number(req.query.uId));

  res.json(remove);
});

app.post('/admin/userpermission/change/v1', (req, res) => {
  const { uId, permissionId } = req.body;
  const token = req.headers.token;
  const permChange = adminPermissionChange(String(token), uId, permissionId);

  res.json(permChange);
});// from shiv

app.get('/user/stats/v1', (req, res) => {
  const notifications = userStats(req.headers.token as string);
  res.json(notifications);
});

app.get('/users/stats/v1', (req, res) => {
  const notifications = usersStats(req.headers.token as string);
  res.json(notifications);
});

app.post('/user/profile/uploadphoto/v1', (req, res) => {
  const { imgUrl, xStart, yStart, xEnd, yEnd } = req.body;
  const token = req.headers.token;
  const photoUpload = userUploadPhoto(String(token), imgUrl, xStart, yStart, xEnd, yEnd);

  res.json(photoUpload);
});

app.get('/search/v1', (req, res) => {
  const messages = search(req.headers.token as string, req.query.queryStr as string);
  res.json(messages);
});

app.post('/message/react/v1', (req, res) => {
  const { messageId, reactId } = req.body;
  const token = req.headers.token;
  const leave = messageReact(token as string, messageId, reactId);
  res.json(leave);
});

app.post('/message/unreact/v1', (req, res) => {
  const { messageId, reactId } = req.body;
  const token = req.headers.token;
  const leave = messageUnreact(token as string, messageId, reactId);
  res.json(leave);
});

app.post('/auth/passwordreset/request/v1', (req, res) => {
  const { email } = req.body;
  const request = authPasswordRequestV1(email);
  res.json(request);
});

app.post('/auth/passwordreset/reset/v1', (req, res) => {
  const { resetCode, newPassword } = req.body;
  const reset = authPasswordResetV1(resetCode, newPassword);
  res.json(reset);
});

// start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
