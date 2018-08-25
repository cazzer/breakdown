import gql from 'graphql-tag'
import { get } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { Query } from 'react-apollo'
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
})

const ItemsList = (props) => {
  const { classes, items } = props
  if (!get(items, ['data', 'allItems', 'nodes'])) return null
  return (
    <div className={classes.root}>
      <List component="nav">
        {items.data.allItems.nodes.map(item => (
          <ListItem key={item.id} >
            <ListItemText
              primary={item.label}
              secondary={item.value}
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

const StyledItemsList = withStyles(styles)(ItemsList)

const query = gql`
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
  <Query query={query}>
    {(itemsQuery) => (
      <StyledItemsList items={itemsQuery} />
    )}
  </Query>
)
