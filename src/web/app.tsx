import React from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import Amplify from '@aws-amplify/core'
import { Auth } from 'aws-amplify'
import { Authenticator, withAuthenticator } from 'aws-amplify-react'
import get from 'lodash/get'

import createClient from './apollo-client'
import Search from './search/view'
import SplitView from './views/split'
import FocusView from './focus/view'
import FocusEdit from './focus/edit'
import Navigation from './navigation'

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

const ConnectedApp = (props) => {
  const client = createClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: props.sessionToken
    }
  })

  return (
    <ApolloProvider client={client}>
      <Navigation />
      <Route path="/home/:parentId/:childId?" component={SplitView} />
      <Route exact path="/view/focus/:itemId?" component={FocusView} />
      <Route path="/view/focus/:itemId/edit" component={FocusEdit} />
      <Route path="/search" component={Search} />
    </ApolloProvider>
  )
}

class App extends React.Component {
  state = {
    sessionToken: null
  }

  componentDidMount() {
    Auth
      .currentSession()
      .then(session => {
        console.log('Session')
        console.log(session)
        this.setState({
          sessionToken: session.idToken.jwtToken
        })
      })
  }

  render() {
    return (
      <BrowserRouter>
        {this.state.sessionToken &&
          <ConnectedApp sessionToken={this.state.sessionToken} />
        }
      </BrowserRouter>
    )
  }
}

export default withAuthenticator(App)
