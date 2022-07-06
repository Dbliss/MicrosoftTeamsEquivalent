// import { type } from 'os';

type channelsInUserType = {
  cId: number,
  channelPermissionsId: number,
};

type userType = {
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  authUserId: number,
  channels: channelsInUserType[],
  handle: string,
  permissionId: number,
};

type usersType = {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
};

type channelsType = {
  channelId: number,
  name: string,
};

type channelType = {
  cId: number,
  name: string,
  isPublic: boolean,
  owners: userType[],
  members: userType[],
  messages: string[],
};

type dataType = {
  user: userType[],
  channel: channelType[],
};

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data: dataType = {
  user: [],
  channel: [],
};

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
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: dataType) {
  data = newData;
}

export { getData, setData, dataType, userType, channelType, channelsType, usersType };
