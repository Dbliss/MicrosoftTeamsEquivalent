import {
  setData, dataType
} from './dataStore';

import crypto from 'crypto';
const SECRET = 'SecretSAUCE';

// <Resets the internal data of the application to its initial state>

// Arguments:
// Function takes in no arguments, {}

// Return Value:
// Function returns an empty object {}

function clearV1() {
  // making a replica of the data structure with zero information
  const emptyData: dataType = {
    user: [],
    channel: [],
    dm: []
  };
  // setting the cleared data as the original
  setData(emptyData);
  return {};
}

function getHashOf(plaintext: string) {
  const hashed = crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
  console.log(`The hashed token value is: ${hashed}`);
  return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
}
export { clearV1, getHashOf };
