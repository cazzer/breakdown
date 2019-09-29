import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Switch, Route } from 'react-router'

import AddLink from './edit/add-link'
import SearchLink from './search/link'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      bottom: theme.spacing(1),
      position: 'fixed',
      right: theme.spacing(1)
    }
  })
)

export default () => {
  const classes = useStyles({})
  return (
    <div className={classes.root}>
      <Switch>
        <Route path="/search" component={null} />
        <Route component={SearchLink} />
      </Switch>
    </div>
  )
}
