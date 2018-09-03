import gql from 'graphql-tag'
import get from 'lodash/get'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { Query } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import DeleteItem from './delete-item'
import { EditItem } from './edit-item'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
})

const ItemsList = (props) => {
  const { classes, items } = props
  const itemNodes = get(items, ['data', 'allItems', 'nodes'])

  if (items.loading) {
    return (
      <div className={classes.root}>
        <Typography>Loading...</Typography>
      </div>
    )
  }

  if (!itemNodes) return null
  if (!itemNodes.length) {
    return (
    <div className={classes.root}>
      <Typography>Nothing here</Typography>
    </div>
    )
  }

  return (
    <div className={classes.root}>
      <List>
        {itemNodes.map(item => {
          return props.match.params.childId === item.id ? (
            <ListItem key={item.id}>
                <EditItem oldItem={item} />
            </ListItem>
          ) : (
            <ListItem button key={item.id}>
              <Link
                to={`/home/${item.parentId ? item.parentId : 'root'}/${item.id}`}
              >
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                />
              </Link>
              <ListItemSecondaryAction>
                <DeleteItem id={item.id} />
              </ListItemSecondaryAction>
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
    {(itemsQuery) => (
      <StyledItemsList items={itemsQuery} />
    )}
  </Query>
)
