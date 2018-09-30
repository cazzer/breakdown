import gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'

import { allItemsQuery } from '../items'

const createItem = gql`
mutation createItem($itemInput: CreateItemInput!) {
  createItem(input: $itemInput) {
    item {
      id,
      label,
      parentId,
      value,
      itemByParentId {
        id,
        label
      }
    }
  }
}
`

export const CreateItem = (props) => (
  <Mutation
    mutation={createItem}
    update={(cache, result) => {
      const data = cache.readQuery({
        query: allItemsQuery,
        variables: {
          condition: {
            parentId: get(props, ['oldItem', 'parentId'])
          }
        }
      })
      cache.writeQuery({
        query: allItemsQuery,
        variables: {
          condition: {
            parentId: get(props, ['oldItem', 'parentId'])
          }
        },
        data: {
          allItems: {
            ...data.allItems,
            nodes: [
              result.data.createItem.item,
              ...data.allItems.nodes
            ]
          }
        }
      })
    }}
  >
    {(createItemMutation) => (
      <StyledEditItem upsert={createItemMutation} {...props} />
    )}
  </Mutation>
)
