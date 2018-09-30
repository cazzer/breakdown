import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import Amplify from '@aws-amplify/core'
import { Auth, Hub, Logger } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'

import createClient from './apollo-client'
import Search from './search/view'
import SplitView from './views/split'
import { FocusWrapperView } from './focus/view'
import { CreateItemView, EditItemView } from './edit/view'
import Navigation, { BelowNavigation } from './navigation'

const BUILD_DATE = process.env.BUILD_DATE
console.log(`Built on ${BUILD_DATE}`)

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

const authLogger = new Logger('auth')

authLogger.onHubCapsule = capsule => {
  console.log(capsule)
}

Hub.listen('auth', authLogger)

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
      <Route render={({ location }) => (
        <BelowNavigation location={location}>
          <Switch location={location}>
            <Route path="/home/:parentId/:childId?" component={SplitView} />
            <Route path="/view/focus/:itemId/edit" component={EditItemView} />
            <Route path="/view/focus/:itemId?" component={FocusWrapperView} />
            <Route path="/add" component={CreateItemView} />
            <Route path="/search" component={Search} />
          </Switch>
        </BelowNavigation>
      )} />
    </ApolloProvider>
  )
}

class App extends React.Component {
  state = {
    sessionToken: null
  }

  refreshToken() {
    console.log('Refreshing session')
    Auth
      .currentSession()
      .then(session => {
        console.log('Got Cognito session')
        console.log(session)
        this.setState({
          sessionToken: session.idToken.jwtToken
        })
      })
  }

  componentDidMount() {
    this.refreshToken()

    this.sessionRefresher = setInterval(
      this.refreshToken.bind(this),
      30 * 60 * 1000
    )
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
