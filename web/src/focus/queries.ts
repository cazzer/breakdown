import gql from 'graphql-tag'

export const fullItem = gql`
fragment fullItem on Item {
  id
  label
  public
  value
  timeCreated
  timeUpdated
  inheritsFrom
  userIsWriter @client
  userIsOwner @client
  permissionsByItemId {
    nodes {
      id
      itemId
      role
      timeCreated
      usersAndGroupByUserOrGroupId {
        id
        name
      }
    }
  }
  itemByInheritsFrom {
    permissionsByItemId {
      nodes {
        id
        itemId
        role
        timeCreated
        usersAndGroupByUserOrGroupId {
          id
          name
        }
      }
    }
  }
}
`

export const itemByIdQuery = gql`
query Item($id: UUID!) {
  itemById(id: $id) {
    ...fullItem
  }
}
`

export const recentItemsQuery = gql`
query RecentItems {
  allItems(
    orderBy: TIME_UPDATED_DESC,
    first: 30
  ) {
    nodes {
      ...fullItem
    }
  }
}
`

export const itemChildrenQuery = gql`
query ItemChildren($condition: ItemRelationshipCondition!) {
  allItemRelationships(condition: $condition, orderBy: TIME_CREATED_ASC) {
    nodes {
      id
      itemByChildId {
        ...fullItem
      }
    }
  }
}
`

export const createItemMutation = gql`
mutation createItemMutation($itemInput: CreateItemInput!) {
  createItem(input: $itemInput) {
    item {
      ...fullItem
    }
  }
}
`

export const updateItemMutation = gql`
mutation updateItem($itemInput: UpdateItemByIdInput!) {
  updateItemById(input: $itemInput) {
    item {
      ...fullItem
    }
  }
}
`
