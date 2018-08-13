import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Amplify from '@aws-amplify/core'

import Login from './login/login'

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

export default () => (
  <BrowserRouter>
    <div>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Login} />
    </div>
  </BrowserRouter>
)
