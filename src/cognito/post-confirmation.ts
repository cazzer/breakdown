import get from 'lodash/get'
import db from '../database'

export default async function postConf(event, context) {
  console.log(event)

  const userId = get(event, 'request.userAttributes.sub', null)

  if (!userId) {
    return context.fail('No userID found in userAttributes', event)
  }

  try {
    await db('users_and_groups')
      .insert({
        id: userId,
        name: event.userName
      })
  } catch (error) {
    console.error(`role and grants not successful for user ${userId}`, error)
    return context.fail(event)
  }

  console.log(`role and grants successful for ${userId}`)
  return context.succeed(event)
}
