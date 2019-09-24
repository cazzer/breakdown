import gql from 'graphql-tag'

export const createPermissionMutation = gql`
  mutation createPermission($permissionInput: CreatePermissionInput!) {
    createPermission(input: $permissionInput) {
      permission {
        id
        itemId
        userOrGroupId
        role
        timeCreated
        usersAndGroupByUserOrGroupId {
            id
            name
            timeCreated
          }
      }
    }
  }
`

export const deletePermissionMutation = gql`
  mutation deletePermission($permission: DeletePermissionByIdInput!) {
    deletePermissionById(input: $permission) {
      permission {
        id
      }
    }
  }
`
