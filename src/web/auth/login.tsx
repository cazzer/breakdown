import classNames from 'classnames'
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

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

  handleLogin = () => {
    this.props.login(this.state)
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


export default withStyles(styles)(Login)
