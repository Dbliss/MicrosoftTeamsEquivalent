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
            'isPublic': Person1Publicity,
            'channels': [ cIds ]
        },

    ],
    channel: [
        {
            'cId': cId,
            'name': 'Channel1name',
            'isPublic': Channel1publicity,
            'start': Channel1start,
            'members': [ uIDs ]
        },
    ]
}