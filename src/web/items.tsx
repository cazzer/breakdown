import gql from 'graphql-tag'
import get from 'lodash/get'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { Query } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/Delete'

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
  if (!get(items, ['data', 'allItems', 'nodes'])) return null
  return (
    <div className={classes.root}>
      <List component="nav">
        {items.data.allItems.nodes.map(item => {
          return props.match.params.itemId === item.id ? (
            <ListItem key={item.id}>
                <EditItem oldItem={item} />
            </ListItem>
          ) : (
            <Link to={`/home/${item.id}`} key={item.id}>
              <ListItem button>
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                />
                <ListItemSecondaryAction>
                  <DeleteItem id={item.id} />
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
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
query AllItems {
  allItems {
    nodes {
      id,
      label,
      value
    }
  }
}
`

export default () => (
  <Query query={allItemsQuery}>
    {(itemsQuery) => (
      <StyledItemsList items={itemsQuery} />
    )}
  </Query>
)
