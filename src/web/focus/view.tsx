import get from 'lodash/get'
import gql from 'graphql-tag'
import React, { Component } from 'react'
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

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 4
  },
  root: {
    margin: theme.spacing.unit
  },
  parentLink: {
    position: 'absolute',
    top: '64px',
    left: '6px'
  }
})

class FocusView extends Component {
  onClickHandler = () => {
    this.props.history.push(
      `${this.props.location.pathname}/edit`
    )
  }

  render() {
    const { classes, item } = this.props
    return (
      <div>
        {item.itemByParentId && (
          <Link to={`/view/focus/${item.itemByParentId.id}`} className={classes.parentLink}>
            <Button mini variant="fab" color="default" aria-label="Parent">
              <ArrowUpward />
            </Button>
          </Link>
        )}
        <Paper className={classes.root}>
          <Grid
            container
            className={classes.content}
            onClick={this.onClickHandler}
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
        </Paper>
        <ItemList parentId={item.id} />
      </div>
    )
  }
}

const StyledFocusView = withStyles(styles)(FocusView)

const itemQuery = gql`
query Item($id: UUID!) {
  itemById(id: $id) {
    id
    label
    value,
    itemByParentId {
      id,
      label
    }
  }
}
`

export default (props) => (
  <Query
    query={itemQuery}
    variables={{
      id: get(props.match.params, 'itemId', null)
    }}
  >
    {(itemQuery => (
      itemQuery.loading
        ? null
        : <StyledFocusView item={itemQuery.data.itemById} {...props} />
    ))}
  </Query>
)
