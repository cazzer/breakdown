import gql from 'graphql-tag'
import React from 'react'
import { useMutation } from 'react-apollo'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import { removeItemFromAllItems, removeFromRecentItems } from './cache-handlers'

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

export default function (props) {
  const [deleteItem] = useMutation(deleteItemMutation, {
    update: (cache) => {
      if (props.parentId) {
        removeItemFromAllItems(cache, props, props.parentId)
      }
      removeFromRecentItems(cache, props)
    }
  })

  return (
    <DeleteItem
      deleteItem={deleteItem}
      {...props}
    />
  )
}
