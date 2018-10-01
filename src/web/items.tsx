import gql from 'graphql-tag'
import get from 'lodash/get'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { Query } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EyeIcon from '@material-ui/icons/RemoveRedEye'

import DeleteItem from './delete-item'
import { EditItem } from './edit/view'
import Loading from './loading'

const styles = theme => ({
  empty: {
    marginTop: theme.spacing.unit
  },
  root: {
  },
  listItem: {
    display: 'flex',
    flexGrow: 1
  },
  listItemLink: {
    width: '100%'
  },
  listItemActions: {
    display: 'flex',
    flexDirection: 'column'
  }
})

const ItemsList = (props) => {
  const { classes, items } = props

  if (!items.length) {
    return (
    <div className={classes.empty}>
      <Typography align="center" variant="caption">
        Nothing here
      </Typography>
    </div>
    )
  }

  return (
    <div className={classes.root}>
      <List>
        {items.map(item => {
          return props.match.params.childId === item.id ? (
            <ListItem key={item.id}>
                <EditItem oldItem={item} />
            </ListItem>
          ) : (
            <ListItem button className={classes.listItem} divider key={item.id}>
              <Link className={classes.listItemLink} to={`/view/focus/${item.id}/edit`}>
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                />
              </Link>
              <div className={classes.listItemActions}>
                <Link to={`/view/focus/${item.id}`}>
                  <IconButton aria-label="Focus">
                    <EyeIcon />
                  </IconButton>
                </Link>
                <DeleteItem id={item.id} />
              </div>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

const StyledItemsList = compose(
  withRouter,
  withStyles(styles)
)(ItemsList)

export const allItemsQuery = gql`
query AllItems($condition: ItemCondition!) {
  allItems(condition: $condition) {
    nodes {
      id,
      label,
      value,
      parentId,
      itemByParentId {
        id,
        label
      }
    }
  }
}
`

export default (props: Object) => (
  <Query
    variables={{
      condition: {
        parentId: (props.parentId !== 'root') ? props.parentId : null
      }
    }}
    query={allItemsQuery}
  >
    {({ loading, data }) => (
      loading
        ? <Loading />
        : <StyledItemsList items={get(data, ['allItems', 'nodes'], [])} />
    )}
  </Query>
)
