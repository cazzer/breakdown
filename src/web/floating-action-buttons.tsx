import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Switch, Route } from 'react-router'

import AddLink from './edit/add-link'
import SearchLink from './search/link'

const styles = theme => ({
  root: {
    bottom: theme.spacing.unit,
    position: 'fixed',
    right: theme.spacing.unit
  }
})

const FloatingActionButtons = ({ classes }) => (
  <div className={classes.root}>
    <Switch>
      <Route path="/view/focus/:itemId" component={AddLink} />
      <Route path="/add" component={null} />
      <Route component={AddLink} />
    </Switch>
    <SearchLink />
  </div>
)

export default withStyles(styles)(FloatingActionButtons)
