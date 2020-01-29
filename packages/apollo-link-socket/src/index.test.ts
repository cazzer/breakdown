import WebSocket from 'ws'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'

import createWebSocketLink from 'apollo-link-socket'

const PORT = 7999

let client
let server
let socket

beforeEach(() => {
  server = new WebSocket.Server({
    port: PORT
  })
  socket = new WebSocket(`http://localhost:${PORT}`)
  client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createWebSocketLink(socket)
  })

  server.on('connection', (socket) => {
    socket.on('message', (rawData) => {
      const data = JSON.parse(rawData)

      // by default, this server will just echo a request by ID
      socket.send(JSON.stringify({
        data: {
          query: {
            id: 1234,
            __typename: 'test'
          }
        },
        __requestId: data.__requestId
      }))
    })
  })

  server.on('error', (error) => {
    console.error(error)
  })
})

afterEach((done) => {
  server.close(done)
})

describe('Apollo WebSocketLink', () => {
  it('Resolves a request by ID', async () => {
    expect.assertions(3)

    const result = await client.query({
      query: gql`query TestQuery { query { id } }`
    })

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('loading')
    expect(result.loading).toBe(false)
  })

  it('Resolves a request multiple times for a subscription', async () => {
    expect.assertions(1)

    debugger
    await client
      .subscribe({
        query: gql`subscription TestSubscription { query { id } }`
      })
      .subscribe({
        next(data) {
          console.log(data)
          expect(true).toBe(true)
        },
        error(error) {
          console.error(error)
          fail(error)
        }
      })
  })
})
