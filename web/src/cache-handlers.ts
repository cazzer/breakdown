import { DataProxy } from 'apollo-cache'

import {
  itemParentsQuery
} from './groups/queries'
import {
  itemByIdQuery,
  itemChildrenQuery,
  recentItemsQuery
} from './focus/queries'

export function addPermissionToItem(
  cache: DataProxy,
  permission: any
) {
  const id = permission.itemId
  const data: any = cache.readQuery({
    query: itemByIdQuery,
    variables: { id }
  })

  cache.writeQuery({
    query: itemByIdQuery,
    variables: { id },
    data: {
      itemById: {
        ...data.itemById,
        permissionsByItemId: {
          ...data.itemById.permissionsByItemId,
          nodes: [
            ...data.itemById.permissionsByItemId.nodes,
            permission
          ]
        }
      }
    }
  })
}


export function removePermissionFromItem(
  cache: DataProxy,
  oldPermission: any
) {
  const data: any = cache.readQuery({
    query: itemByIdQuery,
    variables: { id: oldPermission.itemId }
  })

  cache.writeQuery({
    query: itemByIdQuery,
    variables: { id: oldPermission.itemId },
    data: {
      itemById: {
        ...data.itemById,
        permissionsByItemId: {
          ...data.itemById.permissionsByItemId,
          nodes: data.itemById.permissionsByItemId.nodes.filter(permission => permission.id !== oldPermission.id)
        }
      }
    }
  })
}

export function removeFromRecentItems(
  cache: DataProxy,
  removedItem: any
) {
  removeFromCache({
    cache,
    query: recentItemsQuery,
    dataKey: 'allItems',
    filter: item => item.id !== removedItem.id
  })
}

export function addToRecentItems(
  cache: DataProxy,
  newItem: any
) {
  addToCache({
    cache,
    query: recentItemsQuery,
    dataKey: 'allItems',
    item: newItem
  })
}

export function removeItemFromAllItems(
  cache: DataProxy,
  removedItem: any,
  parentId: string
) {
  removeFromCache({
    cache,
    query: itemChildrenQuery,
    variables: { condition: { parentId } },
    dataKey: 'allItemRelationships',
    filter: relationship => relationship.itemByChildId.id !== removedItem.id
  })
}

export function addItemToAllItems(
  cache: DataProxy,
  addedItem: Object,
  parentId?: String
) {
  addToCache({
    addLast: true,
    cache,
    variables: { condition: { parentId } },
    dataKey: 'allItemRelationships',
    item: addedItem,
    query: itemChildrenQuery,
  })
}

export function updateItemInAllItems(
  cache: DataProxy,
  updatedItem: any,
) {
  updateInCache({
    cache,
    variables: { id: updatedItem.id },
    dataKey: 'itemById',
    item: updatedItem,
    filter: item => (
      item.id === updatedItem.id
        ? updatedItem
        : item
    ),
    query: itemByIdQuery
  })
}

export function updateItemInItemChildren (
  cache: DataProxy,
  parentId: string,
  updatedItem: any
) {
  updateInCache({
    cache,
    item: updatedItem,
    variables: { condition: { parentId } },
    dataKey: 'allItemRelationships',
    filter: item => (
      item.id === updatedItem.id
        ? updatedItem
        : item
    ),
    query: itemChildrenQuery,
  })
}

export function addParentToChild (
  cache: DataProxy,
  relationship: object,
  childId: string
) {
  addToCache({
    addLast: true,
    cache,
    variables: { condition: { childId } },
    dataKey: 'allItemRelationships',
    item: relationship,
    query: itemParentsQuery
  })
}

export function removeParentFromChild(
  cache: DataProxy,
  relationshipId: string,
  childId: string
) {
  removeFromCache({
    cache,
    variables: { condition: { childId } },
    dataKey: 'allItemRelationships',
    filter: (item: { id: string }) => item.id !== relationshipId,
    query: itemParentsQuery
  })
}

export function removeChildFromParent(
  cache: DataProxy,
  relationshipId: string,
  parentId: string
) {
  removeFromCache({
    cache,
    variables: { condition: { parentId } },
    dataKey: 'allItemRelationships',
    filter: (item: { id: string }) => item.id !== relationshipId,
    query: itemChildrenQuery
  })
}

function addToCache({
  addLast,
  cache,
  variables = {},
  dataKey,
  item,
  query,
} : {
  addLast?: boolean
  cache: DataProxy,
  variables?: object,
  dataKey: string,
  item: any,
  query: any,
}) {
  let data: any
  try {
    data = cache.readQuery({
      query,
      variables
    })
  }
  catch (error) {
    console.error(error)
    data = {
      [dataKey]: {
        nodes: [],
        ___typename: item.__typename
      }
    }
  }

  const nodes = addLast
    ? [ ...data[dataKey].nodes, item ]
    : [ item, ...data[dataKey].nodes ]

  cache.writeQuery({
    query,
    variables,
    data: {
      [dataKey]: {
        ...data[dataKey],
        nodes
      }
    }
  })
}

function updateInCache(options : {
  cache: DataProxy,
  variables?: object,
  dataKey: string,
  item: any,
  filter: Function,
  query: any,
}) {
  try {
    modifyInCache({
      ...options,
      modifier: 'map'
    })
  }
  catch (error) {
    addToCache(options)
  }
}

function removeFromCache(options : {
  cache: DataProxy,
  variables?: object,
  dataKey: string,
  filter: Function,
  query: any,
}) {
  modifyInCache({
    ...options,
    modifier: 'filter'
  })
}

function modifyInCache({
  cache,
  variables = {},
  dataKey,
  filter,
  item,
  modifier,
  query,
} : {
  cache: DataProxy,
  variables?: object,
  dataKey: string,
  filter: Function,
  item?: any,
  modifier: string,
  query: any,
}) {
  let data: any
  try {
    data = cache.readQuery({
      query,
      variables
    })
  }
  catch (error) {
    // it's ok to cache miss if we're removing the item anyway
    if (modifier === 'filter') {
      return
    } else {
      throw error
    }
  }

  cache.writeQuery({
    query,
    variables,
    data: {
      [dataKey]: data[dataKey].nodes
        ? {
          ...data[dataKey],
          nodes: data[dataKey].nodes[modifier](filter)
        }
        : { ...data[dataKey], ...item }
    }
  })
}
