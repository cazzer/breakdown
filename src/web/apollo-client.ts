import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { RetryLink } from 'apollo-link-retry'
import { ApolloLink } from 'apollo-link'

export default function createClient(httpOptions) {
  return new ApolloClient({
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
      new RetryLink({
        attempts: {
          retryIf: response => {
            console.log(response)
            return true
          }
        }
      }),
      new HttpLink(httpOptions),
    ]),
    cache: new InMemoryCache()
  })
}
