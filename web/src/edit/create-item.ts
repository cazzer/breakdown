import gql from 'graphql-tag'

export default gql`
  mutation createItem($itemInput: CreateItemInput!) {
    createItem(input: $itemInput) {
      item {
        id
        inheritsFrom
        label
        value
        timeCreated
        timeUpdated
      }
    }
  }
`
