import { getData, setData, dmType } from "./dataStore";

function dmCreate (token: string, uIds: number[]) {
    const data = getData();
    
    let validToken = 0;
    let flag = 0;
    for(let i = 0; i < data.user.length; i++) {
        for (const tokens of data.user[i].token) {
            if (tokens === token) {
                validToken = 1;
                flag = i;
            }
        }
    }

    if(validToken === 0) {
        return {error: 'error'};
    }

    let validUId = 0;
    let uIdRepeat = 0;
    let dmNames =  [];
    for(const uId of uIds) {
        for(const user of data.user) {
            if(uId === user.authUserId) {
                dmNames.push(user.handle);
                validUId++;
            }
        }
        for(const repeat of uIds) {
            if(repeat === uId) {
                uIdRepeat++;
            }
        }
    }

    if(validUId < uIds.length || uIdRepeat > 1) {
        return {error: 'error'};
    }

    let name = '';
    dmNames = dmNames.sort();
    for(let handle of dmNames) {
        name = handle + ', ';
    }
    name = "'" + name + "'";

    uIds.push(data.user[flag].authUserId);
    let tempDm: dmType = {
        dmId: Math.floor(Math.random() * Date.now()),
        name: name,
        members: uIds,
        owners: [data.user[flag].authUserId],
    };

    data.dm.push(tempDm);
    setData(data);
    return {dmId: tempDm.dmId};

    
}

function dmList (token: string) {
    const data = getData();
    
    let validToken = 0;
    let flag = 0;
    for(let i = 0; i < data.user.length; i++) {
        for (const tokens of data.user[i].token) {
            if (tokens === token) {
                validToken = 1;
                flag = i;
            }
        }
    }
    
    if(validToken === 0) {
        return {error: 'error'};
    }

    const authUserId = data.user[flag].authUserId;
    let tempDms = [];
    for(let dm of data.dm) {
        for(let member of dm.members) {
            if(member === authUserId) {
                tempDms.push({dmId: dm.dmId, name: dm.name});
            }
        }
    }
    return tempDms;
}

function dmRemove (token: string, dmId: number) {
    const data = getData();
    
    let validToken = 0;
    let flag = 0;
    for(let i = 0; i < data.user.length; i++) {
        for (const tokens of data.user[i].token) {
            if (tokens === token) {
                validToken = 1;
                flag = i;
            }
        }
    }
    
    if(validToken === 0) {
        return {error: 'error'};
    }

    const ownersIndex = 0;
    let dmIndex = 0;
    let validDmId = 0;
    let validCreator = 0;
    let isMember = 0;

    for(let dm of data.dm) {
        if(dm.dmId === dmId) {
            validDmId = 1;
            for(let member of dm.members) {
                if(member === data.user[flag].authUserId) {
                    isMember = 1;
                }
            }
            if(isMember === 0) {
                return {error: 'error'};
            }

            if(dm.owners[ownersIndex] === data.user[flag].authUserId) {
                validCreator = 1;
                data.dm.splice(dmIndex, 1);
            }
        }
        dmIndex++;
    }

    if(validDmId === 0 || validCreator === 0) {
        return {error: 'error'};
    }

    setData(data);
    return {};
}




export {dmCreate, dmList, dmRemove};
