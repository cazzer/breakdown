import Auth from '@aws-amplify/auth'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist'
import { setContext } from 'apollo-link-context'

const authLink = setContext(async (request) => {
  const session = await Auth.currentSession()

  return {
    headers: {
      Authorization: session.idToken.jwtToken
    }
  }
})

const cache = new InMemoryCache()

persistCache({
  debug: process.env.NODE_ENV !== 'production',
  cache,
  storage: window.localStorage,
})

export default new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
    }),
    authLink,
    new HttpLink({
      uri: process.env.GRAPHQL_ENDPOINT
    }),
  ]),
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-and-network'
    }
  }
})
