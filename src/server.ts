import express from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { channelInviteV2, channelMessagesV2 } from './channel';
import { channelsCreateV1 } from './channels';
import { clearV1 } from './other';

import {
  channelsListV1,
  channelsListallV1,
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
  messageRemoveV1
} from './message';

// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/register/v2', (req, res, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    return res.json(authRegisterV1(email, password, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/login/v2', (req, res, next) => {
  try {
    const { email, password } = req.body;
    return res.json(authLoginV1(email, password));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/invite/v2', (req, res, next) => {
  try {
    const { token, channelId, uId } = req.body;
    return res.json(channelInviteV2(token, channelId, uId));
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

app.post('/channels/create/v2', (req, res) => {
  const { token, name, isPublic } = req.body;
  const cId = channelsCreateV1(token, name, isPublic);
  res.json(cId);
});

app.get('/channels/list/v2', (req, res) => {
  const channel = channelsListV1(req.query.token as string);
  res.json(channel);
});

app.get('/channels/listall/v2', (req, res) => {
  const channel = channelsListallV1(req.query.token as string);
  res.json(channel);
});

app.post('/auth/logout/v1', (req, res, next) => {
  try {
    const { token } = req.body;
    return res.json(authLogoutV1(token));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/create/v1', (req, res) => {
  const { token, uIds } = req.body;
  const dmId = dmCreate(token, uIds);
  res.json(dmId);
});

app.get('/dm/list/v1', (req, res) => {
  const dms = dmList(req.query.token as string);
  res.json(dms);
});

app.delete('/dm/remove/v1', (req, res) => {
  const remove = dmRemove(req.query.token as string, parseInt(req.query.dmId as string));
  res.json(remove);
});

app.get('/dm/details/v1', (req, res) => {
  const dms = dmDetails(req.query.token as string, parseInt(req.query.dmId as string));
  res.json(dms);
});

app.post('/dm/leave/v1', (req, res) => {
  const { token, dmId } = req.body;
  const leave = dmLeave(token, dmId);
  res.json(leave);
});

app.get('/dm/messages/v1', (req, res) => {
  const messages = dmMessages(req.query.token as string, parseInt(req.query.dmId as string), parseInt(req.query.start as string));
  res.json(messages);
});

app.post('/channel/leave/v1', (req, res, next) => {
  try {
    const { token, channelId } = req.body;
    return res.json(channelLeaveV1(token, channelId));
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

app.post('/channel/addowner/v1', (req, res, next) => {
  try {
    const { token, channelId, uId } = req.body;
    return res.json(channelAddOwnerV1(token, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.put('/message/edit/v1', (req, res, next) => {
  try {
    const { token, channelId, message } = req.body;
    return res.json(messageEditV1(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/removeowner/v1', (req, res, next) => {
  try {
    const { token, channelId, uId } = req.body;
    return res.json(channelRemoveOwnerV1(token, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.delete('/message/remove/v1', (req, res, next) => {
  try {
    const token = req.query.token as string;
    const messageId = req.query.messageId;
    return res.json(messageRemoveV1(token, Number(messageId)));
  } catch (err) {
    next(err);
  }
});

// for logging errors
app.use(morgan('dev'));

// start server
app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});
