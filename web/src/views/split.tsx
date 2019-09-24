import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import { CreateItem } from '../edit/view'
import ItemList from '../items'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
})

function SplitView(props) {
  const { classes, match } = props

  const { childId, parentId } = match.params
  const createItemParentId = childId || (
    parentId !== 'root' ? parentId : null
  )

  return (
    <div className={classes.root}>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <CreateItem oldItem={{ parentId: createItemParentId }} />
          </Paper>
        </Grid>
        <Grid item xs={childId ? 6 : 12}>
          <Paper className={classes.paper}>
            <ItemList parentId={parentId} />
          </Paper>
        </Grid>
        {childId && (
          <Grid item xs={childId ? 6 : 12}>
            <Paper className={classes.paper}>
              <ItemList parentId={childId} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default withStyles(styles)(SplitView);
