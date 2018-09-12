import get from 'lodash/get'
import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 4
  },
  root: {
    margin: theme.spacing.unit
  },
  title: {
  }
})

const FocusEditView = ({ classes, item }) => (
  <Paper className={classes.root}>
    <Grid container className={classes.content}>
      <FormControl fullWidth>
        <Grid className={classes.title} item xs={12} xl={4}>
          <TextField
            id="label"
            label="label"
            fullWidth
            value={item.label}
          />
        </Grid>
        <Grid className={classes.title} item xs={12} xl={8}>
          <TextField
            id="value"
            label="value"
            fullWidth
            multiline
            rowsMax={12}
            value={item.value}
          />
        </Grid>
      </FormControl>
    </Grid>
  </Paper>
)

const StyledFocusView = withStyles(styles)(FocusEditView)

const itemQuery = gql`
query Item($id: UUID!) {
  itemById(id: $id) {
    id
    label
    value
  }
}
`

export default (props) => (
  <Query
    query={itemQuery}
    variables={{
      id: get(props.match.params, 'itemId')
    }}
  >
    {(itemQuery => (
      itemQuery.loading
        ? null
        : <StyledFocusView item={itemQuery.data.itemById} />
    ))}
  </Query>
)
