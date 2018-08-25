import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import { Authenticator, withAuthenticator } from 'aws-amplify-react'
import { get } from 'lodash'

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
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: get(props, 'authData.signInUserSession.idToken.jwtToken')
    }
  })
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div>
          <Route path="/login" component={Authenticator} />
          <Route path="/register" component={Login} />
          <Route path="/home" component={SplitView} />
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default withAuthenticator(App)
