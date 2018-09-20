import { Auth } from 'aws-amplify'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { compose } from 'recompose'
import { withRouter } from 'react-router'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import SearchLink from './search/link'


const styles = theme => ({
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
  belowNavigation: {
    paddingTop: 64
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

class Navigation extends React.Component {
  state = {
    anchorEl: null,
  }

  handleLogout = async () => {
    try {
      await Auth.signOut()
      this.props.history.push('/')
    } catch (error) {
      console.error(error)
    }

    this.handleClose()
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes } = this.props
    const open = !!this.state.anchorEl
    return (
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/home/root" className={classes.flex}>
            <Typography variant="title" color="inherit">
              Breakdown
            </Typography>
          </Link>
          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(Navigation)

const belowNavigation = ({ classes, children, location }) => (
  <div className={classes.belowNavigation}>
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames={{
          enter: classes.slideEnter,
          enterActive: classes.slideEnterActive,
          exit: classes.slideExit,
          exitActive: classes.slideExitActive
        }}
        timeout={300}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
    <SearchLink />
  </div>
)

export const BelowNavigation = withStyles(styles)(belowNavigation)
