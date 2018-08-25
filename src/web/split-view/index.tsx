import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import EditItem from '../edit-item'
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

function SplitView(props) {
  const { classes } = props

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <EditItem />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ItemList />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(SplitView);
