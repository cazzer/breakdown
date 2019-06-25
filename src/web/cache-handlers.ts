import { DataProxy } from 'apollo-cache'

import itemChildrenQuery from './item-children.gql'
import parentsByChildId from './groups/item-parents.gql'
import recentItemsQuery from './recent-items.gql'
import itemByIdQuery from './focus/item-by-id.gql'

export function removeFromRecentItems(
  cache: DataProxy,
  removedItem: Object
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
  newItem: Object
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
  removedItem: Object,
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
  updatedItem: Object,
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
    query: parentsByChildId
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
    query: parentsByChildId
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
