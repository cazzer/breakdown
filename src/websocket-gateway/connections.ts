import epsagon from '../epsagon'

export const connect = epsagon.lambdaWrapper(async (event: any) => {
  console.log(event)

  return {
    body: 'Connected',
    statusCode: 200
  }
})

export const disconnect = epsagon.lambdaWrapper(async (event: any) => {
  console.log(event)

  return {
    body: 'Disconnected',
    statusCode: 200
  }
})
