```javascript
// TODO: insert your data structure that contains users + channels info here
// You may also add a short description explaining your design
```

database = {
    user: [
        {
            'email': 'Person1@x.com',
            'password': 'Person1Password',
            'nameFirst': 'Person1firstname',
            'nameLast': 'Person1lastname',
            'authUserId': Person1authUserId,
            'channels': [ {cId: ,
                           channelPermissionId: ,
                        }, ]
            'handle': 'person1firstnameperson1lastname'
            'permissionId': permissionId,
        },
    ],
    channel: [
        {
            'cId': cId,
            'name': 'Channel1name',
            'isPublic': Channel1publicity,
            'owners': [ memberuIds ]
            'members': [ uIDs ]
            'messages': [ messages ]
        },
    ]
}

