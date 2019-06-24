import { DataProxy } from 'apollo-cache'

import itemChildrenQuery from './item-children.gql'
import parentsByChildId from './groups/item-parents.gql'
import recentItemsQuery from './recent-items.gql'
import itemByIdQuery from './focus/item-by-id.gql'

const DEFAULT_ALL_ITEMS_DATA = {
  allItems: {
    nodes: [],
    __typename: 'ItemsConnection'
  }
}

export function removeFromRecentItems(
  cache: DataProxy,
  removedItem: Object
) {
  let data
  try {
    data = cache.readQuery({
      query: recentItemsQuery
    })
  } catch (error) {
    return
  }

  cache.writeQuery({
    query: recentItemsQuery,
    data: {
      allItems: {
        ...data.allItems,
        nodes: data.allItems.nodes.filter(item => (
          item.id !== removedItem.id
        ))
      }
    }
  })
}

export function addToRecentItems(
  cache: DataProxy,
  newItem: Object
) {
  let data
  try {
    data = cache.readQuery({
      query: recentItemsQuery
    })
  } catch (error) {
    data = DEFAULT_ALL_ITEMS_DATA
  }

  cache.writeQuery({
    query: recentItemsQuery,
    data: {
      allItems: {
        ...data.allItems,
        nodes: [
          newItem,
          ...data.allItems.nodes
        ]
      }
    }
  })
}

export function removeItemFromAllItems(
  cache: DataProxy,
  removedItem: Object,
  parentId: String
) {
  let data
  try {
    data = cache.readQuery({
      query: itemChildrenQuery,
      variables: {
        condition: {
          parentId
        }
      }
    })
  } catch (error) {
    return
  }

  cache.writeQuery({
    query: itemChildrenQuery,
    variables: {
      condition: {
        parentId
      }
    },
    data: {
      allItemRelationships: {
        ...data.allItemRelationships,
        nodes: data.allItemRelationships.nodes.filter(relationship => (
          relationship.itemByChildId.id !== removedItem.id
        ))
      }
    }
  })
}

export function addItemToAllItems(
  cache: DataProxy,
  addedItem: Object,
  parentId?: String
) {
  let data

  try {
    data = cache.readQuery({
      query: itemChildrenQuery,
      variables: {
        condition: {
          parentId
        }
      }
    })
  }
  catch (error) {
    data = DEFAULT_ALL_ITEMS_DATA
  }

  cache.writeQuery({
    query: itemChildrenQuery,
    variables: {
      condition: {
        parentId
      }
    },
    data: {
      allItemRelationships: {
        ...data.allItemRelationships,
        nodes: [
          ...data.allItemRelationships.nodes,
          addedItem
        ]
      }
    }
  })
}

export function updateItemInAllItems(
  cache: DataProxy,
  updatedItem: Object,
) {
  let data

  try {
    data = cache.readQuery({
      query: itemByIdQuery,
      variables: {
        condition: {
          id: updatedItem.id
        }
      }
    })
  }
  catch (error) {
    // it's ok if this list isn't in the cache yet,
    // we'll add it
    return addItemToAllItems(
      cache,
      updatedItem,
    )
  }

  // ok the list is in the cache, time to do some work
  cache.writeQuery({
    query: itemChildrenQuery,
    variables: {
      condition: {
        parentId
      }
    },
    data: {
      allItems: {
        ...data.allItemRelationships,
        nodes: data.allItemRelationships.nodes.map(item => (
          item.id === updatedItem.id
            ? updatedItem
            : item
        ))
      }
    }
  })
}

export function addParentToChild (
  cache: DataProxy,
  relationship: object,
  childId: string
) {
  let data = cache.readQuery({
    query: parentsByChildId,
    variables: {
      condition: {
        childId
      }
    }
  })

  cache.writeQuery({
    query: parentsByChildId,
    variables: {
      condition: {
        childId
      }
    },
    data: {
      allItemRelationships: {
        ...data.allItemRelationships,
        nodes: [
          ...data.allItemRelationships.nodes,
          relationship
        ]
      }
    }
  })
}

export function removeParentFromChild(
  cache: DataProxy,
  relationshipId: string,
  childId: string
) {
  let data = cache.readQuery({
    query: parentsByChildId,
    variables: {
      condition: {
        childId
      }
    }
  })

  cache.writeQuery({
    query: parentsByChildId,
    variables: {
      condition: {
        childId
      }
    },
    data: {
      allItemRelationships: {
        ...data.allItemRelationships,
        nodes: data.allItemRelationships.nodes.filter(item => (
          item.id !== relationshipId
        ))
      }
    }
  })
}
