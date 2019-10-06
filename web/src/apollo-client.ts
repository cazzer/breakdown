import Auth from '@aws-amplify/auth'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { persistCache } from 'apollo-cache-persist'
import { setContext } from 'apollo-link-context'

let ROLES: string

const authLink = setContext(async () => {
  const session = await Auth.currentSession()
  ROLES = session.getIdToken().decodePayload().roles

  return {
    headers: {
      Authorization: session.getIdToken().getJwtToken()
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
      uri: process.env.GRAPHQL_ENDPOINT,
    })
  ]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  },
  resolvers: {
    Item: {
      userIsWriter(item) {
        const direct = item.permissionsByItemId && !!item.permissionsByItemId.nodes.find(
          permission => (
            ROLES.indexOf(permission.usersAndGroupByUserOrGroupId.id) > -1
            && permission.role === 'WRITER'
          )
        )
        const inherited = item.itemByInheritsFrom && !!item.itemByInheritsFrom.permissionsByItemId.nodes.find(
          permission => (
            ROLES.indexOf(permission.usersAndGroupByUserOrGroupId.id) > -1
            && permission.role === 'WRITER'
          )
        )

        return direct || inherited
      },
      userIsOwner() {
        return false
      }
    }
  }
})
