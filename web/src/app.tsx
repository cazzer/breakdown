import React from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import Amplify from '@aws-amplify/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { init } from '@sentry/browser'
import WebSocket from 'react-websocket'

import Login from './auth/login'
import Register from './auth/register'
import createClient from './apollo-client'
import Search from './search/view'
import SplitView from './views/split'
import { FocusWrapperView } from './focus/view'
import { CreateItemView, EditItemView } from './edit/view'
import Navigation, { BelowNavigation } from './navigation'
import { AuthContext, AuthProvider } from './auth/withAuth'
import { CubeLoader } from './loading'
import { RecentItemList } from './items'

const buildDate = new Date(process.env.BUILD_TIMESTAMP)
console.log(`Built on ${buildDate.toString()}`)

if (process.env.NODE_END === 'production') {
  init({
    dsn: process.env.SENTRY_DSN
  })
}

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
  typography: {
    // useNextVariants: true,
  }
})

const RedirectFocus = () => (
  <Redirect to="/view/focus" />
)

const WebSocketProvider = (props) => {

  const onConnect = () => {
    console.log('connected')
  }

  const onMessage = message => {
    console.log(message)
  }

  return (
    <AuthContext.Consumer>
      {({ token }) => (
        <WebSocket
          url={`${process.env.WEBSOCKET_URL}?token=${token}`}
          onOpen={onConnect}
          onMessage={onMessage}
        />
      )}
    </AuthContext.Consumer>
  )
}

function ConnectedApp({ token }) {
  const client = createClient(token)

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Navigation />
        <BelowNavigation>
          <Switch>
            <Route path="/home/:parentId/:childId?" component={SplitView} />
            <Route path="/view/focus/:itemId/edit" component={EditItemView} />
            <Route path="/view/focus/:itemId" component={FocusWrapperView} />
            <Route path="/view/focus" component={RecentItemList} />
            <Route path="/add" component={CreateItemView} />
            <Route path="/search" component={Search} />
            <Route component={RedirectFocus} />
          </Switch>
        </BelowNavigation>
      </ApolloProvider>
    </BrowserRouter>
  )
}

const ConnectedLogin = (props) => (
  <AuthContext.Consumer>
    {({ loading, login }) => (
      <Login { ...props } loading={loading} login={login} />
    )}
  </AuthContext.Consumer>
)

const ConnectedRegister = (props) => (
  <AuthContext.Consumer>
    {({ register }) => (
      <Register { ...props } register={register} />
    )}
  </AuthContext.Consumer>
)

const RedirectLogin = () => (
  <Redirect to="/login" />
)

const AuthApp = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={ConnectedLogin} />
      <Route path="/register" component={ConnectedRegister} />
      <Route component={RedirectLogin} />
    </Switch>
  </BrowserRouter>
)

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <AuthProvider>
          <AuthContext.Consumer>
            {({ loading, loggedIn, token }) => {
              if (loading) {
                return <CubeLoader />
              }
              return loggedIn
                ? <ConnectedApp token={token} />
                : <AuthApp />
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      </MuiThemeProvider>
    )
  }
}

export default App
