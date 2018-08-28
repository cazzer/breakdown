import React, { ReactPropTypes } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import { CreateItem } from '../edit-item'
import ItemList from '../items'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
})

function SplitView(props: ReactPropTypes) {
  const { classes, match } = props

  const itemId = match.params.itemId

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <CreateItem oldItem={{ parentId: itemId }} />
          </Paper>
        </Grid>
        <Grid item xs={itemId ? 6 : 12}>
          <Paper className={classes.paper}>
            <ItemList />
          </Paper>
        </Grid>
        {itemId && (
          <Grid item xs={itemId ? 6 : 12}>
            <Paper className={classes.paper}>
              <ItemList parentId={itemId} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default withStyles(styles)(SplitView);
