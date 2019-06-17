import get from 'lodash/get'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { compose } from 'redux'
import { Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'

import ItemList from '../items'
import { RedBox } from '../red-box'
import { Groups } from '../groups/view'

import ValueView from './value-view'
import itemByIdQuery from './item-by-id.gql'

const styles = theme => ({
  backButton: {
    margin: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(4)
  },
  item: {
    margin: theme.spacing(1)
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
          <Groups childId={item.id} />
          <Link to={`/view/focus/${item.id}/edit`}>
            <Grid
              container
              className={classes.content}
            >
              <Grid className={classes.title} item xs={12} xl={4}>
                <Typography color="textPrimary" variant="h6">
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

const StyledFocusView = compose(
  withStyles(styles),
  RedBox,
)(FocusView)

const ConnectedFocusView = ({ match }) => (
  <Query
    query={itemByIdQuery}
    variables={{
      id: match.params.itemId
    }}
  >
    {(itemQuery => (
      <StyledFocusView
        error={itemQuery.error}
        item={get(itemQuery.data, 'itemById')}
        loading={itemQuery.loading}
      />
    ))}
  </Query>
)

export const FocusWrapperView = (props) => (
  <div>
    <Route path="/view/focus/:itemId" component={ConnectedFocusView} />
    <ItemList parentId={get(props.match.params, 'itemId', null)} />
  </div>
)
