import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import moment from 'moment'
import FloatingActionButtons from './floating-action-buttons'
import { AuthContext } from './auth/withAuth'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    flex: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    noOutline: {
      outline: 'none'
    },
    belowNavigation: {
      paddingTop: 64,
      paddingBottom: 64
    },
    slideEnter: {
      position: 'relative',
      left: '100%'
    },
    slideEnterActive: {
      position: 'relative',
      transition: 'left 300ms cubic-bezier(0.230, 1.000, 0.320, 1.000)',
      left: 0
    },
    slideExit: {
      position: 'relative',
      left: 0
    },
    slideExitActive: {
      position: 'relative',
      transition: 'left 300ms cubic-bezier(0.230, 1.000, 0.320, 1.000)',
      left: '-100%'
    },
  })
)

export default function Navigation() {
  const [state, setState] = useState({
    anchorEl: null,
  })

  const handleMenu = event => {
    setState({ anchorEl: event.currentTarget });
  }

  const handleClose = () => {
    setState({ anchorEl: null });
  }

  const classes = useStyles({})
  const open = !!state.anchorEl

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link to="/view/focus" className={classes.flex}>
          <Typography color="textPrimary" variant="h6">
            Breakdown
          </Typography>
        </Link>
        <div>
          <IconButton
            aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <AuthContext.Consumer>
            {({ clearCache, logout, user }) => (
              <Menu
                id="menu-appbar"
                anchorEl={state.anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <ListSubheader className={classes.noOutline}>
                  logged in as {user.username}
                </ListSubheader>
                <Divider />
                <MenuItem onClick={logout}>Logout</MenuItem>
                <MenuItem onClick={clearCache}>Clear Cache</MenuItem>
                <Divider />
                <ListSubheader className={classes.noOutline}>
                  built {moment(process.env.BUILD_TIMESTAMP).calendar().toLowerCase()}
                </ListSubheader>
              </Menu>
            )}
          </AuthContext.Consumer>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export const BelowNavigation = ({ children }) => {
  const classes = useStyles({})
  return (
    <div className={classes.belowNavigation}>
      {children}
      <FloatingActionButtons />
    </div>
  )
}
