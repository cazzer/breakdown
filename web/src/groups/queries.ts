import gql from 'graphql-tag'

export const createRelationshipMutation = gql`
mutation createRelationship($relationshipInput: CreateItemRelationshipInput!) {
  createItemRelationship(input: $relationshipInput) {
    itemRelationship {
      id
    }
  }
}
`

export const deleteRelationshipMutation = gql`
mutation deleteRelationship($relationshipInput: DeleteItemRelationshipInput!) {
  deleteItemRelationship(input: $relationshipInput) {
		itemRelationship {
      childId
      parentId
    }
  }
}
`

export const deleteRelationshipByIdMutation = gql`
mutation deleteRelationship($relationshipInput: DeleteItemRelationshipByIdInput!) {
  deleteItemRelationshipById(input: $relationshipInput) {
		itemRelationship {
      id
    }
  }
}
`

export const itemParentsQuery = gql`
query ItemParents($condition: ItemRelationshipCondition!) {
  allItemRelationships(condition: $condition) {
    nodes {
      id
      itemByParentId {
        id
        label
      }
    }
  }
}
`
