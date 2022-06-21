import {getData, setData} from 'dataStore.js'


function clearV1() {
  setData({});
  return {};
}

export { clearV1 };
