import { get } from 'lodash'
import db from '../database'

export default async function preTokenGeneration(event) {
  console.log(event)

  const userId = event.request.userAttributes.sub

  console.log(`Getting group memberships for user ${userId}`)
  const roles = await db('user_group_membership')
    .select('group_id')
    .where('member_id', userId)

  console.log(roles)

  console.log('Building token roles')
  return {
    ...event,
    response: {
      claimOverrideDetails: {
        claimsToAddOrOverride: {
          roles: [userId]
        }
      }
    }
  }
}
