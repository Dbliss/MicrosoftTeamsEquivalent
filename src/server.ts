import express from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import { channelDetailsV1, channelJoinV1 } from './channel';
import { usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1, userProfileV1} from './users';

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

//WRAPPING CHANNEL FUNCTIONS - channelDetailsV1 (GET) and channelJoinV1 (POST)

app.get('channel/details/v2', (req, res/*, next*/) => { //what is this next thing in the get request?
  const token = req.query.token;
  const channelId = req.query.channelId;
  console.log(token);
  return res.json(channelDetailsV1(String(token), Number(channelId))); //might need to change channelDetails input
                                                                           // to taken in tokens not numbers

  // const data = req.query.echo as string;
  // return res.json(echo(data));

});

app.post('channel/join/v2', (req, res) => {
  const body = JSON.parse(req.body);
  const token = body.token;
  const channelId = body.channelId;
  return res.json(channelJoinV1(token, channelId));
  // return res.json(echo(data));
   
});

//WRAPPING USERS FUNCTIONS - userProfileV1 (GET), user/profile/setname/v1 (PUT), user/profile/setemail/v1 (PUT),
// user/profile/sethandle/v1 (PUT), users/all/v1 (GET)

app.get('user/profile/v2', (req, res/*, next*/) => { //what is this next thing in the get request?
  const token = req.query.token;
  const uId = req.query.uId;
  return res.json(userProfileV1(String(req.query.token), Number(req.query.uId))); //might need to change input
                                                                           // to take in tokens not numbers
});

app.get('users/all/v1', (req, res/*, next*/) => { //what is this next thing in the get request?
  const token = req.query.token;
  return res.json(usersAllV1(String(token))); //might need to change input
                                                                           // to take in tokens not numbers
});

app.put('user/profile/setname/v1', (req, res) => {
  const body = JSON.parse(req.body);
  const token = body.token;
  const nameFirst = body.nameFirst;
  const nameLast = body.nameLast;
  
  return res.json(userProfileSetNameV1(token, nameFirst, nameLast));
});

app.put('user/profile/setemail/v1', (req, res) => {
  const body = JSON.parse(req.body);
  const token = body.token;
  const email = body.email;
  
  return res.json(userProfileSetEmailV1(token, email));
});

app.put('user/profile/sethandle/v1', (req, res) => {
  const body = JSON.parse(req.body);
  const token = body.token;
  const handleStr = body.handleStr;
  
  return res.json(userProfileSetHandleV1(token, handleStr));
});






// for logging errors
app.use(morgan('dev'));

// start server
app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});
