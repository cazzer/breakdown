import React from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import Amplify from '@aws-amplify/core'
import { Authenticator, withAuthenticator } from 'aws-amplify-react'
import get from 'lodash/get'

import createClient from './apollo-client'
import Search from './search/view'
import SplitView from './split-view'

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

const App = (props: Object) => {
  console.log('Application Rendered')
  console.log(props)
  const sessionToken = get(props, 'authData.signInUserSession.idToken.jwtToken')

  const client = createClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: sessionToken
    }
  })

  return (
    <BrowserRouter>
      <div>
        <Route path="/login" component={Authenticator} />
        <ApolloProvider client={client}>
          <Route path="/home/:parentId/:childId?" component={SplitView} />
          <Route path="/search" component={Search} />
        </ApolloProvider>
      </div>
    </BrowserRouter>
  )
}

export default withAuthenticator(App)
