Assumptions :

1. If a invalid authUserId is passed to channelsListV1 a empty array will be returned. 

2. If a invalid authUserId is passed to channelsListAllV1 a empty array will be returned. 

3. If a invalid authUserId is passed to channelsCreateV1, it will return ({error: 'error'})

4. If an invalid authUserId is passed to channelJoinV1 the function will return {error: 'error'}

5. A valid channelpermissionId is either a 1 for channel owner permissions or a 2 for member permissions

6. Once a global owner is invited through channelInviteV1, they are treated as a member until further action is taken by channel owner

7. Token is a combination of letters and numbers randomly generated such that is a lesser chance of repetition 

8. Token is an array of string to store multiple tokens for each user session 
