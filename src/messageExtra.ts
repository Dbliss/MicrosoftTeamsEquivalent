import { getData, setData, channelType, messageType, dataType } from './dataStore';
import { getTokenIndex } from './users';
import HTTPError from 'http-errors';

export function messageShareV1(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const data: dataType = getData();
  const sharedMessageId = 0;
  return { sharedMessageId };
}

export function messagePinV1(token: string, MessageId: number) {
  const data: dataType = getData();
  return {};
}

export function messageUnpinV1(token: string, MessageId: number) {
  const data: dataType = getData();
  return {};
}

export function messageSendLaterV1(token: string, channelId: number, message: string, timeSent: number) {
  const data: dataType = getData();
  const messageId = 0;
  return { messageId };
}

export function messageSendLaterDmV1(token: string, dmId: number, message: string, timeSent: number) {
  const data: dataType = getData();
  const messageId = 0;
  return { messageId };
}
