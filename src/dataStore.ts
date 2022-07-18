// import { type } from 'os';
import fs from 'fs';

// Storing info about which channel user is part of
type channelsInUserType = {
  cId: number,
  channelPermissionsId: number,
};

// Storing User in data
type userType = {
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  authUserId: number,
  channels: channelsInUserType[],
  handle: string,
  permissionId: number,
  token: string[],
};

// Used for output in channelDetails
type usersType = {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
};

// Used in channelsList and channelsAll
type channelsType = {
  channelId: number,
  name: string,
};

// Storing messages with its Id
type messageType = {
  messageId: number,
  message: string
};

// Storing channel information in data
type channelType = {
  cId: number,
  name: string,
  isPublic: boolean,
  owners: userType[],
  members: userType[],
  messages: messageType[],
};

// Storing dm information in data
type dmType = {
  dmId: number,
  name: string,
  members: number[],
  owners: number[],
  messages: messageType[]
}

type dataType = {
  user: userType[],
  channel: channelType[],
  dm: dmType[],
};

// YOU SHOULD MODIFY THIS OBJECT BELOW

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  const storedData = (fs.readFileSync('src/data.json'));
  const data = JSON.parse(String(storedData));
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: dataType) {
  fs.writeFileSync('src/data.json', JSON.stringify(newData), { flag: 'w' });
}

export { getData, setData, dataType, userType, channelType, channelsType, usersType, dmType, messageType };
