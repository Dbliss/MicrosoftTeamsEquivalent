import{
  setData,
} from './dataStore.js';

function clearV1() {
  
  let emptyData = {
    'user': [],
    'channel':[],
  }
  
  setData(emptyData);
  
  return {};
}

export { clearV1 };
