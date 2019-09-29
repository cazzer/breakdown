import classNames from 'classnames'
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      flexBasis: 200,
    },
    button: {
      margin: theme.spacing(1)
    },
    input: {
      display: 'none',
    }
  })
)

export default function Login(props) {
  const [state, setState] = useState({
    password: '',
    showPassword: false,
    username: ''
  })

  const handleLogin = () => {
    props.login(state)
  }

  const handleFormKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  const handleUpdateName = event => {
    setState({
      ...state,
      username: event.target.value,
    })
  }

  const handleUpdatePassword = event => {
    setState({
      ...state,
      password: event.target.value,
    })
  }

  const handleClickShowPassword = () => {
    setState({
      ...state,
      showPassword: !state.showPassword,
    })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const { loading } = props
  const classes = useStyles({})

  return (
    <Grid container>
      <Grid item xs={1} md={3} />
      <Grid item xs={10} md={6}>
        <form onKeyDown={handleFormKeyPress}>
          <Grid container spacing={8}>
              <Grid item xs={12}>
                <FormControl
                  className={classNames(classes.margin, classes.textField)}
                  fullWidth
                >
                  <TextField
                    autoComplete="on"
                    autoFocus={true}
                    id="username"
                    label="username"
                    onChange={handleUpdateName}
                    value={state.username}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  className={classNames(classes.margin, classes.textField)}
                  fullWidth
                >
                  <TextField
                    id="adornment-password"
                    label="password"
                    onChange={handleUpdatePassword}
                    type={state.showPassword ? 'text' : 'password'}
                    value={state.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {state.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </Grid>
            <Grid item xs={6}>
              <Button
                className={classes.button}
                color="primary"
                disabled={loading}
                fullWidth
                onClick={handleLogin}
                size="large"
                variant="contained"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Link to="/register">
                <Button
                  className={classes.button}
                  fullWidth
                  size="large"
                  variant="contained"
                >
                  Register
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
