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
      await Auth.currentSession()

      this.setState({
        loading: false,
        loggedIn: true
      })
    } catch (error) {
      return this.setState({
        loading: false,
        loggedIn: false
      })
    }
  }

 login = async ({ username, password }) => {
    try {
      const result = await Auth.signIn(username, password)
      if (result.signInUserSession.idToken) {
        this.setState({
          loading: false,
          loggedIn: true
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
      sessionToken: null
    })
  }

  register = async ({ username, password}) => {
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
        login: this.login,
        logout: this.logout,
        register: this.register
      }}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
