Assumptions :

1. If a invalid authUserId is passed to channelsListAllV1 or channelsListV1, a empty array will be returned. 

2. If a invalid authUserId is passed to channelsCreateV1, it will return ({error: 'error'})

3. If an invalid authUserId is passed to channelDetailsV1 the function will return {error: 'error'}

4. If an invalid authUserId is passed to channelJoinV1 the function will return {error: 'error'}

5. If an invalid authUserId is passed to userProfileV1 the function will return {error: 'error'}

6. An invalid email string is when there is no "@" or "." in the email string parameter 

7. A valid channelpermissionId is either a 1 for channel owner permissions or a 2 for member permissions

8. Once a global owner is invited through channelInviteV1, they are treated as a member until further action is taken by channel owner
