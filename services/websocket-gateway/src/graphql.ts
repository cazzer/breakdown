import { ApiGatewayManagementApi } from 'aws-sdk'
import get from 'lodash/get'
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile'
import { Pool } from 'pg'
import { graphql } from 'graphql'
import { serializeError } from 'serialize-error'

import * as config from './config'
import epsagon from './epsagon'

const apigwManagementApi = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: config.WEBSOCKET_URL,
})

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
  console.log('Authorizer:\n', event.requestContext.authorizer)
  const userId = get(event, 'requestContext.authorizer.sub')
  const roles = [
    ...get(event, 'requestContext.authorizer.roles', '')
      .split(',')
      // remove empty strings
      .filter(uuid => uuid),
    userId
  ].join(',')
  const connectionId = event.requestContext.connectionId
  const graphqlInput = JSON.parse(event.body).body
  console.log(`GraphQL query:\n`, graphqlInput)
  console.log(`Starting ${graphqlInput.operationName} for ${userId}`)
  console.time(`${userId}/${graphqlInput.operationName}`)
  console.log('Roles:\n', roles)

  let postgraphileSchema: any

  console.log('Awaiting schema')
  try {
    postgraphileSchema = await postgraphileSchemaPromise
  } catch (error) {
    console.error('Rebuilding schema after connection loss')
    postgraphileSchema = await createPostGraphileSchema(
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
    console.log(`Finished ${graphqlInput.operationName} for ${userId}`, result)
    console.timeEnd(`${userId}/${graphqlInput.operationName}`)
    return await apigwManagementApi.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        ...result,
        errors: result.errors.map(serializeError)
      }),
    }).promise()
  } catch (error) {
    console.error(error)
    console.timeEnd(`${userId}/${graphqlInput.operationName}`)
    return {
      body: JSON.stringify(error),
      statusCode: 500
    }
  }
})
