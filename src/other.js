import{
  setData,
} from './dataStore.js';


//<Resets the internal data of the application to its initial state> 

// Arguments:
    // Function takes in no arguments, {}

// Return Value:
    // Function returns an empty object {}

function clearV1() {
  // making a replica of the data structure wiht zero information
  let emptyData = {
    'user': [],
    'channel': [],
  }
  // setting the cleared data as the original
  setData(emptyData);
  
  return {};
}

export { clearV1 };
