import { DataProxy } from 'apollo-cache'

import { allItemsQuery } from './items'
import parentsByChildId from './groups/item-parents.gql'

export function removeItemFromAllItems(
  cache: DataProxy,
  removedItem: Object,
  parentId: String
) {
  try {
    let data = cache.readQuery({
      query: allItemsQuery,
      variables: {
        condition: {
          parentId
        }
      }
    })

    cache.writeQuery({
      query: allItemsQuery,
      variables: {
        condition: {
          parentId
        }
      },
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
  catch (error) {
    // it's ok if this query hasn't been cached,
    // less work for us
    return
  }
}

export function addItemToAllItems(
  cache: DataProxy,
  addedItem: Object,
  parentId: String
) {
  let data

  try {
    data = cache.readQuery({
      query: allItemsQuery,
      variables: {
        condition: {
          parentId
        }
      }
    })
  }
  catch (error) {
    // it's ok if this list isn't in the cache yet,
    // we'll add it
    data = {
      allItems: {
        nodes: [],
        __typename: 'ItemsConnection'
      }
    }
  }

  cache.writeQuery({
    query: allItemsQuery,
    variables: {
      condition: {
        parentId
      }
    },
    data: {
      allItems: {
        ...data.allItems,
        nodes: [
          addedItem,
          ...data.allItems.nodes
        ]
      }
    }
  })
}

export function updateItemInAllItems(
  cache: DataProxy,
  updatedItem: Object,
  parentId: String
) {
  let data

  try {
    data = cache.readQuery({
      query: allItemsQuery,
      variables: {
        condition: {
          parentId
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
      parentId
    )
  }

  // ok the list is in the cache, time to do some work
  cache.writeQuery({
    query: allItemsQuery,
    variables: {
      condition: {
        parentId
      }
    },
    data: {
      allItems: {
        ...data.allItems,
        nodes: data.allItems.nodes.map(item => (
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
