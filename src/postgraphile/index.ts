import get from 'lodash/get'
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile'
import Pool from 'pg-pool'
import { graphql } from 'graphql'

import * as config from '../config'


const postgraphileSchemaPromise = createPostGraphileSchema(
  config.DB_ENDPOINT,
  config.DB_SCHEMA
)

const pool = new Pool({
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  min: 0,
  max: 1
})

export default async function graphqlHandler(event) {
  console.log(event)
  console.log(event.requestContext.authorizer)
  const userId = get(event, 'requestContext.authorizer.claims.sub')
  const roles = get(event, 'requestContext.authorizer.claims.roles', userId)
  const graphqlInput = JSON.parse(event.body)
  console.log(`Starting ${graphqlInput.operationName} for ${userId}`)
  console.time(`${userId}/${graphqlInput.operationName}`)

  try {
    const postgraphileSchema = await postgraphileSchemaPromise
    const result = await withPostGraphileContext(
      {
        pgPool: pool,
        pgDefaultRole: 'application_user',
        pgSettings: {
          'jwt.claims.roles': roles
        }
      },
      async context => {
        return await graphql(
          postgraphileSchema,
          graphqlInput.query,
          null,
          { ...context },
          graphqlInput.variables,
          graphqlInput.operationName
        )
      }
    )
    console.log(`Finished ${graphqlInput.operationName} for ${userId}`)
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(result),
      statusCode: 200
    }
  } catch (error) {
    console.error(error)
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(error),
      statusCode: 500
    }
  }

  console.timeEnd(`${userId}/${graphqlInput.operationName}`)
}
