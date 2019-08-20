import epsagon from '../epsagon'

export async function connect(event: any): Promise<object> {
  console.log(event)

  return {
    body: 'Connected',
    statusCode: 200
  }
}

export async function disconnect(event: any): Promise<object> {
  console.log(event)

  return {
    body: 'Disconnected',
    statusCode: 200
  }
}
