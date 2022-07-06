// import { type } from 'os';

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  user: [],
  channel: [],

};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1
type userType = {
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  authUserId: number,
  channels: number[],
  handle: string,
  permissionId: number,
};

type channelType = {
  cId: number,
  name: string,
  isPublic: boolean,
  owners: object[],
  members: object[],
  messages: object[],
};

type dataType = {
  user: userType[],
  channel: channelType[],
};

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

export { getData, setData, dataType, userType, channelType };
