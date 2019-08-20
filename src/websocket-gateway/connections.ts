import epsagon from '../epsagon'

export const connect = epsagon.lambdaWrapper((event: any) => {
  console.log(event)

  return {
    body: 'Connected',
    statusCode: 200
  }
})

export const disconnect = epsagon.lambdaWrapper((event: any) => {
  console.log(event)

  return {
    body: 'Disconnected',
    statusCode: 200
  }
})
