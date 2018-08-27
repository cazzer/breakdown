import React, { Component } from 'react'
import {
  BrowserRouter,
  Redirect,
  Route
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

import Amplify from '@aws-amplify/core'
import { Authenticator, withAuthenticator } from 'aws-amplify-react'
import get from 'lodash/get'

import Login from './login/login'
import SplitView from './split-view'

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

const App = (props) => {
  const sessionToken = get(props, 'authData.signInUserSession.idToken.jwtToken')

  const client = new ApolloClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: sessionToken
    }
  })

  return (
    <BrowserRouter>
      <div>
        {!sessionToken
          && <Redirect to="/login" />
        }
        <Route path="/login" component={Authenticator} />
        <Route path="/register" component={Login} />
        <ApolloProvider client={client}>
          <Route path="/home/:itemId?" component={SplitView} />
        </ApolloProvider>
      </div>
    </BrowserRouter>
  )
}

export default withAuthenticator(App)
