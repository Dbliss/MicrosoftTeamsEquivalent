import { getData, setData, channelType, usersType } from './dataStore';

type returnObjectType = {
  name: string,
  isPublic: boolean,
  ownerMembers: usersType[],
  allMembers: usersType[],
};

type tempMembersType = {
  email: string,
    handleStr: string,
    nameFirst: string,
    nameLast: string,
    uId: number,
};

type errorType = {
  error: string;
};

function messageSendV1(token: string, channelId: number, message: string) {
    
    return { messageId };
}


function messageEditV1(token: string, channelId: number, message: string) {
    
    return { messageId };
}


function messageRemoveV1(token: string, messageId: number) {
    
    return {};
}