import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import React from 'react'

export const AuthContext = React.createContext(null)

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  }
})

export class AuthProvider extends React.Component {
  state = {
    loading: true,
    loggedIn: null
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession()
      const user = await Auth.currentUserInfo()

      this.setState({
        loading: false,
        loggedIn: true,
        user,
        token: session.getIdToken().getJwtToken()
      })
    } catch (error) {
      return this.setState({
        loading: false,
        loggedIn: false,
        user: false
      })
    }
  }

  login = async ({ username, password }) => {
    this.setState({
      loading: true
    })

    try {
      const result = await Auth.signIn(username, password)
      if (result.signInUserSession.idToken) {
        const session = await Auth.currentSession()
        const user = await Auth.currentUserInfo()
        this.setState({
          loading: false,
          loggedIn: true,
          user,
          token: session.getIdToken().getJwtToken()
        })
      } else {
        this.setState({
          loading: false,
          loggedIn: true
        })
      }
    }
    catch (error) {
      return error
    }
  }

  logout = async () => {
    await Auth.signOut()
    this.setState({
      loggedIn: false,
      user: null
    })
  }

  clearCache = () => {
  }

  register = async ({ username, password}) => {
    this.setState({
      loading: true
    })

    try {
      await Auth.signUp(username, password)
      this.login({ username, password })
    }
    catch(error) {
      return error
    }
  }

  render() {
    return (
      <AuthContext.Provider value={{
        ...this.state,
        clearCache: this.clearCache,
        login: this.login,
        logout: this.logout,
        register: this.register
      }}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
