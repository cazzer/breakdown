import { DynamoDB } from 'aws-sdk'

const DDBDocClient = new DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

export async function connect(event: any) {
  console.log(event)

  await DDBDocClient.put({
    Item: {
      connection_id: event.requestContext.connectionId,
      user_id: event.requestContext.authorizer.userId
    },
    TableName: process.env.CONNECTIONS_TABLE_NAME
  }).promise()

  return {
    body: 'Connected',
    statusCode: 200
  }
}

export async function disconnect(event: any) {
  console.log(event)

  DDBDocClient.delete({
    Key: {
      connection_id: event.requestContext.connectionId
    },
    TableName: process.env.CONNECTIONS_TABLE_NAME
  })

  return {
    body: 'Disconnected',
    statusCode: 200
  }
}
