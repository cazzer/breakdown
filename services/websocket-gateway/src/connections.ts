import { DynamoDB } from 'aws-sdk'

import epsagon from './epsagon'

const DDBDocClient = new DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

export const connect = epsagon.lambdaWrapper(async (event: any) => {
  console.log('Saving the connection')
  await DDBDocClient.put({
    Item: {
      connection_id: event.requestContext.connectionId,
      user_id: event.requestContext.authorizer.userId
    },
    TableName: process.env.CONNECTIONS_TABLE_NAME
  }).promise()

  console.log('Connection saved')
  return {
    body: 'Connected',
    statusCode: 200
  }
})

export const disconnect = epsagon.lambdaWrapper(async (event: any) => {
  console.log('Deleting the connection...')
  await DDBDocClient.delete({
    Key: {
      connection_id: event.requestContext.connectionId
    },
    TableName: process.env.CONNECTIONS_TABLE_NAME
  }).promise()

  console.log('Deleted connection')
  return {
    body: 'Disconnected',
    statusCode: 200
  }
})
