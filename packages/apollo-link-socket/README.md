# Apollo Link Socket
> Socket your Apollo with this handy Link!

This library aims to add WebSocket support to Apollo Client in a sever-abstract manner.

## Use
1. Bring your own socket to the party
```ts
const socket: WebSocket = new WebSocket('wss://mywebsocket.com')
```
2. Create a link with the socket
```ts
const socketLink = createWebSocketLink(socket)
```
3. Toss that link in your Apollo client
```ts
const client = new ApolloClient({
  link: ApolloLink.from([
    ...,
    socketLink,
    ...
  ])
})
```

## How it works


## Building
1. Clone me and `yarn install` the dependencies
2. Run `yarn build` to JavaScript the TypeScript
3. Run `yarn test` to make sure all the things installed and build correctly
