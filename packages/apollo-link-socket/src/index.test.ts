import WebSocket from 'ws'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'

import createWebSocketLink from 'apollo-link-socket'

const PORT = 7999

let server

beforeEach(() => {
  server = new WebSocket.Server({
    port: PORT
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
})

afterEach(() => {
  server.close()
})

describe('Apollo WebSocketLink', () => {
  it('Connects to a WebSocket', () => {
    const socket = new WebSocket(`http://localhost:${PORT}`)
    createWebSocketLink(socket)

    server.on('connection', () => {
      expect(true)
    })
  })

  it('Resolves a request by ID', async () => {
    expect.assertions(1)

    const socket = new WebSocket(`http://localhost:${PORT}`)
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: createWebSocketLink(socket)
    })

    await client.query({
      query: gql`query TestQuery { query { id } }`
    })

    expect(true).toBe(true)
  })
})
