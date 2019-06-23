import React from 'react'
import { useMutation } from 'react-apollo'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import createItemMutation from '../edit/create-item.gql'
import { addItemToAllItems } from '../cache-handlers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemLoading: {
      background: `
        repeating-linear-gradient(
          135deg,
          transparent,
          transparent 10px,
          ${theme.palette.primary.dark} 10px,
          ${theme.palette.primary.dark} 20px
        )
      `
    }
  })
)

export default function CreateNewItem(props) {
  const [createItem, { error, loading }] = useMutation(createItemMutation)
  const classes = useStyles()

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
        const newItem = mutationResult.data.createItem.item
        addItemToAllItems(proxy, newItem, null)
        props.onCreate(newItem)
      }
    })
  }

  return (
    <List>
      <ListItem
        button
        classes={{
          root: loading ? classes.listItemLoading : undefined
        }}
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
