import get from 'lodash/get'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ArrowUpward from '@material-ui/icons/ArrowUpward'

import ItemList from '../items'

import ValueView from './value-view'
import itemByIdQuery from './item-by-id.gql'

const styles = theme => ({
  backButton: {
    margin: theme.spacing.unit
  },
  content: {
    padding: theme.spacing.unit * 4
  },
  item: {
    margin: theme.spacing.unit
  },
  root: {
    flowGrow: 1
  }
})

class FocusView extends Component {
  render() {
    const { classes, item } = this.props
    return (
      <div className={classes.root}>
        <Paper className={classes.item}>
          {item.itemByParentId && (
            <Link to={`/view/focus/${item.itemByParentId.id}`}>
              <Button variant="outlined" className={classes.backButton}>
                <ArrowUpward />
                {item.itemByParentId.label}
              </Button>
            </Link>
          )}
          <Link to={`/view/focus/${item.id}/edit`}>
            <Grid
              container
              className={classes.content}
            >
              <Grid className={classes.title} item xs={12} xl={4}>
                <Typography variant="h6">
                  {item.label}
                </Typography>
              </Grid>
              <Grid className={classes.title} item xs={12} xl={8}>
                <ValueView value={item.value} />
              </Grid>
            </Grid>
          </Link>
        </Paper>
      </div>
    )
  }
}

const StyledFocusView = withStyles(styles)(FocusView)

const ConnectedFocusView = ({ match }) => (
  <Query
    query={itemByIdQuery}
    variables={{
      id: match.params.itemId
    }}
  >
    {(itemQuery => (
      itemQuery.loading
        ? null
        : <StyledFocusView item={itemQuery.data.itemById} />
    ))}
  </Query>
)

export const FocusWrapperView = (props) => (
  <div>
    <Route path="/view/focus/:itemId" component={ConnectedFocusView} />
    <ItemList parentId={get(props.match.params, 'itemId', null)} />
  </div>
)
