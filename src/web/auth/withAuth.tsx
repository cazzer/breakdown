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
    sessionToken: null
  }

  componentDidMount() {
    this.refreshToken()

    this.refreshTimeout = setInterval(
      this.refreshToken.bind(this),
      45 * 60 * 1000
    )
  }

  login = async ({ username, password }) => {
    try {
      const result = await Auth.signIn(username, password)
      this.setState({
        sessionToken: result.signInUserSession.idToken.jwtToken
      })
    }
    catch (error) {
      return error
    }
  }

  logout = async () => {
    await Auth.signOut()
    this.setState({
      sessionToken: null
    })
  }

  register = async ({ username, password}) => {
    try {
      const result = await Auth.signUp(username, password)
      console.log(result)
      this.login({ username, password })
    }
    catch(error) {
      return error
    }
  }

  refreshTimeout = null

  async refreshToken() {
    try {
      const session = await Auth.currentSession()
      console.log('Got Cognito session')
      this.setState({
        loading: false,
        sessionToken: session.idToken.jwtToken
      })
    }
    catch (error) {
      this.setState({
        loading: false
      })
    }
  }

  render() {
    return (
      <AuthContext.Provider value={{
        ...this.state,
        login: this.login,
        logout: this.logout,
        register: this.register
      }}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
