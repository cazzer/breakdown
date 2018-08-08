import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Login from './login/login'

export default () => (
  <BrowserRouter>
    <div>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Login} />
    </div>
  </BrowserRouter>
)
