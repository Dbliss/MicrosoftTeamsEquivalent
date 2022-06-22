import {
  getData,
  setData,
} from './dataStore.js';


function clearV1() {
  
  let emptyData = {
    'user': [],
    'channel':[],
  }
  setData(emptyData);
}

export { clearV1 };
