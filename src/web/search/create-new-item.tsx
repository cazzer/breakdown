import React from 'react'
import { useMutation } from 'react-apollo'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import createItemMutation from '../edit/create-item.gql'
import { addItemToAllItems } from '../cache-handlers'

export default function CreateNewItem(props) {
  const [createItem, { error, loading }] = useMutation(createItemMutation)

  function handleCreateItem() {
    createItem({
      variables: {
        itemInput: {
          item: {
            label: props.label
          }
        }
      },
      update: (proxy, mutationResult) => {
        addItemToAllItems(proxy, mutationResult, null)
        props.onCreate(mutationResult.data.createItem.item)
      }
    })
  }

  return (
    <List>
      <ListItem
        button
        disabled={loading}
        onClick={handleCreateItem}
      >
        <ListItemText
          primary={props.label}
          primaryTypographyProps={{ color: 'textPrimary'}}
        />
      </ListItem>
    </List>
  )
}
