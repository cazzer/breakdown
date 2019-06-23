import gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import itemChildrenQuery from './item-children.gql'

class DeleteItem extends React.Component {
  state = {
    disabled: false
  }

  handleDeleteClick = () => {
    this.setState({
      disabled: true
    })

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
        disabled={this.state.disabled}
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
    update={(cache) => {
      const data = cache.readQuery({
        query: itemChildrenQuery,
        variables: {
          condition: {
            parentId: props.parentId || null
          }
        }
      })
      cache.writeQuery({
        query: itemChildrenQuery,
        variables: {
          condition: {
            parentId: props.parentId || null
          }
        },
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
