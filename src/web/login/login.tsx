import Auth from '@aws-amplify/auth'
import classNames from 'classnames'
import React, { Component } from 'react'
import { compose } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  IconButton,
  InputLabel,
  Paper
} from '@material-ui/core'
import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  }
})

class Login extends Component {
  state = {
    password: '',
    showPassword: false,
    username: ''
  }

  handleUpdateName = event => {
    this.setState({
      username: event.target.value
    })
  }

  handleUpdatePassword = event => {
    this.setState({
      password: event.target.value
    })
  }

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  handleMouseDownPassword = event => {
    event.preventDefault()
  }

  handleLogin = () => {
    this.props.signIn(
      this.state.username,
      this.state.password
    )
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container>
        <Grid item xs={1} md={3} />
        <Grid item xs={10} md={6}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                fullWidth
              >
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  onChange={this.handleUpdateName}
                  type="text"
                  value={this.state.username}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                fullWidth
              >
                <InputLabel htmlFor="adornment-password">Password</InputLabel>
                <Input
                  id="adornment-password"
                  onChange={this.handleUpdatePassword}
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Button
                className={classes.button}
                color="primary"
                fullWidth
                onClick={this.handleLogin}
                size="large"
                variant="contained"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className={classes.button}
                fullWidth
                href="/register"
                size="large"
                variant="contained"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

function withLogin(WrappedComponent) {
  class WithLogin extends Component {
    render(props) {
      return <WrappedComponent
        {...props}
        {...this.state}
        signIn={Auth.signIn.bind(Auth)}
      />
    }
  }

  WithLogin.displayName = `withEvent(${
    WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'
  })`

  return WithLogin
}

export default compose(
  withLogin,
  withStyles(styles)
)(Login)
