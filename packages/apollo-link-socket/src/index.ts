import { ApolloLink, Observable } from 'apollo-link'
import { print } from 'graphql/language'
import v4 from 'uuid/v4'

const requestCache = {}

export default function createWebSocketLink(
  socket: any
) {
  const connectedSocket = new Promise((resolve, reject) => {
    socket.onopen = () => {
        resolve(socket)
    }
    socket.onerror = (error) => {
        reject(error)
    }
  })

  socket.onmessage = (message) => {
    const response = JSON.parse(message.data)
    const { observer } = requestCache[response.__requestId]

    if (!observer) {
        return
    }

    observer.next(response)
    observer.complete()
    delete requestCache[response.__requestId]
  }

  return new ApolloLink((operation) => {
    const query = print(operation.query)
    return new Observable(observer => {
      connectedSocket
        .then((socket: WebSocket) => {
          const __requestId = v4()

          socket.send(JSON.stringify({
            action: 'graphql',
            body: {
              ...operation,
              query
            },
            __requestId
          }))
          requestCache[__requestId] = {
            observer,
            subscription: false
          }
        })
        .catch(error => {
          console.error(`Socket Error:::::::\n`, error)
          if (error.name === 'AbortError')
              return
          if (error.result && error.result.errors && error.result.data) {
              observer.next(error.result)
          }
          observer.error(error)
        })
    })
  })
}
