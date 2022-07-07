import express from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';

import {
  channelsCreateV1,
  channelsListV1,
  channelsListallV1,
} from './channels';

// Set up web app, use JSON
const app = express();
app.use(express.json());

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

// for logging errors
app.use(morgan('dev'));

// start server
app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

app.post('channels/create/v2', (req, res, next) => {
  const {authUserId, name, isPublic} = req.body;
  const cId = channelsCreateV1(authUserId, name, isPublic);
  res.json(cId);
});
