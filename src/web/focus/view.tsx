import get from 'lodash/get'
import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'
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
  content: {
    padding: theme.spacing.unit * 4
  },
  item: {
    margin: theme.spacing.unit
  },
  root: {
    flowGrow: 1
  },
  parentLink: {
    position: 'absolute',
    top: '64px',
    left: '6px'
  }
})

class FocusView extends PureComponent {
  render() {
    const { classes, item } = this.props
    return (
      <div className={classes.root}>
        {item.itemByParentId && (
          <Link to={`/view/focus/${item.itemByParentId.id}`} className={classes.parentLink}>
            <Button mini variant="fab" color="default" aria-label="Parent">
              <ArrowUpward />
            </Button>
          </Link>
        )}
        <Paper className={classes.item}>
          <Link to={`/view/focus/${item.id}/edit`}>
            <Grid
              container
              className={classes.content}
            >
              <Grid className={classes.title} item xs={12} xl={4}>
                <Typography variant="title">
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

const ConnectedFocusView = (props) => (
  <Query
    query={itemByIdQuery}
    variables={{
      id: props.itemId
    }}
  >
    {(itemQuery => (
      itemQuery.loading && !itemQuery.data.itemById
        ? null
        : <StyledFocusView item={itemQuery.data.itemById} {...props} />
    ))}
  </Query>
)

export const FocusWrapperView = (props) => (
  <div>
    {get(props.match.params, 'itemId') &&
      <ConnectedFocusView itemId={props.match.params.itemId} />
    }
    <ItemList parentId={get(props.match.params, 'itemId', null)} { ...props } />
  </div>
)

