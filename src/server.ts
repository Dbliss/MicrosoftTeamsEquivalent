import express from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { clearV1 } from './other';

import { channelDetailsV1, channelJoinV1 } from './channel';
import { usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1, userProfileV1} from './users';


import {
  channelsCreateV1,
  channelsListV1,
  channelsListallV1,
} from './channels';

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

app.delete('/clear/v1', (req, res, next) => {
  try {
    return res.json(clearV1());
  } catch (err) {
    next(err);
  }
});

app.post('/channels/create/v2', (req, res, next) => {
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

//WRAPPING CHANNEL FUNCTIONS - channelDetailsV1 (GET) and channelJoinV1 (POST)

app.get('/channel/details/v2', (req, res, next) => {
  try {
    const token = req.query.token;
    const channelId = req.query.channelId;
    return res.json(channelDetailsV1(String(token), Number(channelId)));
  } catch (err) {
    next(err);
  } 
   
                                                                           
});

app.post('/channel/join/v2', (req, res, next) => {
  try {
    const {token, channelId} = req.body;
    return res.json(channelJoinV1(token, channelId));
  } catch (err) {
    next(err);
  }
  

   
});


app.get('/user/profile/v2', (req, res, next) => {
  try {
    const token = req.query.token;
    const uId = req.query.uId;
    return res.json(userProfileV1(String(token), Number(uId)));
  } catch (err) {
    next(err);
  }

});

app.get('/users/all/v1', (req, res, next) => { 
  try {
    const token = req.query.token;
    return res.json(usersAllV1(String(token)));
  } catch (err) {
    next(err);
  }

});

app.put('/user/profile/setname/v1', (req, res, next) => {
  try {
    const { token, nameFirst, nameLast } = req.body
  
    return res.json(userProfileSetNameV1(token, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
  
});

app.put('/user/profile/setemail/v1', (req, res, next) => {
  try {
    const { token, email } = req.body
    return res.json(userProfileSetEmailV1(token, email));
  } catch (err) {
    next(err);
  }
  
});

app.put('/user/profile/sethandle/v1', (req, res, next) => {
  try {
    const { token, handleStr } = req.body  
    return res.json(userProfileSetHandleV1(token, handleStr));
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
