import db from '../database'
import epsagon from '../epsagon'

export default epsagon.lambdaWrapper(async (event) => {
  console.log(event)

  const userId = event.request.userAttributes.sub

  console.log(`Getting group memberships for user ${userId}`)
  const roles = await db('user_group_membership')
    .select('group_id')
    .where('member_id', userId)

  console.log(roles)

  console.log('Building token roles')
  const response = {
    ...event,
    response: {
      claimsOverrideDetails: {
        claimsToAddOrOverride: {
          roles: [userId, ...roles].join(',')
        }
      }
    }
  }

  console.log(response)
  return response
})
