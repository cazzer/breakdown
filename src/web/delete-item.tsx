import gql from 'graphql-tag'
import { get } from 'lodash'
import React from 'react'
import { Mutation } from 'react-apollo'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { allItemsQuery } from './items'

class DeleteItem extends React.Component {
  handleDeleteClick = () => {
    this.props.deleteItem({
      variables: {
        itemId: {
          id: this.props.id
        }
      }
    })
  }

  render() {
    return (
      <IconButton
        aria-label="Delete"
        onClick={this.handleDeleteClick}
      >
        <DeleteIcon />
      </IconButton>
    )
  }
}

export const deleteItemMutation = gql`
mutation DeleteItem($itemId: DeleteItemByIdInput!) {
  deleteItemById(input: $itemId) {
    item {
      id
    }
  }
}
`

export default (props) => (
  <Mutation
    mutation={deleteItemMutation}
    update={(cache, result) => {
      const data = cache.readQuery({
        query: allItemsQuery
      })
      cache.writeQuery({
        query: allItemsQuery,
        data: {
          allItems: {
            ...data.allItems,
            nodes: data.allItems.nodes.filter(
              node => node.id !== props.id
            )
          }
        }
      })
    }}
  >
    {(deleteItem) => (
      <DeleteItem
        deleteItem={deleteItem}
        {...props}
      />
    )}
  </Mutation>
)
