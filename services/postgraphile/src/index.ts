import get from 'lodash/get'
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile'
import { Pool } from 'pg'
import { graphql } from 'graphql'

import * as config from './config'
import epsagon from './epsagon'

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

pool.on('error', error => {
  console.error('Postgres generated pool error!', error)
})

export default epsagon.lambdaWrapper(async (
  event: {
    keepWarm?: boolean,
    requestContext: any,
    body: string
  }
) => {
  console.log(event.requestContext.authorizer)
  const userId = get(event, 'requestContext.authorizer.claims.sub')
  const roles = [
    ...get(event, 'requestContext.authorizer.roles', '')
      .split(',')
      // remove empty strings
      .filter(uuid => uuid),
    userId
  ].join(',')
  const graphqlInput = JSON.parse(event.body)
  console.log(`Starting ${graphqlInput.operationName} for ${userId}`)
  console.time(`${userId}/${graphqlInput.operationName}`)

  let postgraphileSchema: any

  console.log('Awaiting schema')
  try {
    postgraphileSchema = await postgraphileSchemaPromise
  } catch (error) {
    console.error('Rebuilding schema after connection loss')
    postgraphileSchema = createPostGraphileSchema(
      config.DB_ENDPOINT,
      config.DB_SCHEMA
    )
  }

  try {
    console.log('Schema ready, awaiting Postgraphile context')
    const result = await withPostGraphileContext(
      {
        pgPool: pool,
        pgDefaultRole: 'application_user',
        pgSettings: {
          'jwt.claims.roles': roles
        }
      },
      async (context: object) => {
        console.log('Context ready, calling operation')
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
    console.timeEnd(`${userId}/${graphqlInput.operationName}`)
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
    console.timeEnd(`${userId}/${graphqlInput.operationName}`)
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(error),
      statusCode: 500
    }
  }
})
