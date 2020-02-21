import gql from 'graphql-tag'
import React from 'react'
import { useMutation } from 'react-apollo'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'

import { removeItemFromAllItems, removeFromRecentItems } from './cache-handlers'

class DeleteItem extends React.Component<any> {
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
      <Tooltip
        arrow
        title="Delete this item"
        placement="left"
      >
        <IconButton
          aria-label="Delete"
          disabled={this.state.disabled}
          onClick={this.handleDeleteClick}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
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
