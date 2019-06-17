import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import uuidv4 from 'uuid/v4'
import { Query, useMutation } from 'react-apollo'
import parentsByChildId from './item-parents.gql'
import SearchDropdown from '../search/dropdown'
import createRelationshipMutation from './create-relationship-mutation.gql'
import deleteRelationshipMutation from './delete-relationship-mutation.gql'
import { removeFromParentsByChildId } from '../cache-handlers'


interface GroupData {
  id: string
  label: string
  new: boolean
  relationshipId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(0.5)
    },
    chip: {
      margin: theme.spacing(0.5)
    }
  })
)

function EditGroupView(props: {
  childId: string,
  group: GroupData
}) {
  const classes = useStyles()
  const things = useMutation(deleteRelationshipMutation)
  const [deleteRelationship, { called, data }] = things

  const handleDelete = () => () => {
    deleteRelationship({
      variables: {
        relationshipInput: {
          id: props.group.relationshipId
        }
      }
    })
  }

  if (data) {
    removeFromParentsByChildId(props.group.relationshipId, props.childId)
  }

  return (
    <Chip
      className={classes.chip}
      clickable={!called}
      label={props.group.label}
      onDelete={handleDelete()}
      variant={called ? 'outlined' : 'default'}
    />
  )
}

function EditGroupsView(props) {
  const classes = useStyles()
  const [groups, setGroups] = React.useState<GroupData[]>(
    props.groups
  )
  const [addRelationship, { addLoading, addData }] = useMutation(createRelationshipMutation)

  const handleSelect = (groupToAdd: GroupData) => {
    setGroups(groups => [
      ...groups,
      groupToAdd.id ? groupToAdd : {
        id: uuidv4(),
        label: groupToAdd.label,
        new: true
      }
    ])

    addRelationship({
      variables: {
        relationshipInput: {
          itemRelationship: {
            childId: props.childId,
            parentId: groupToAdd.id
          }
        }
      }
    })
  }

  return (
    <>
      {groups.map((group: GroupData) => (
        <EditGroupView
          childId={props.childId}
          key={group.relationshipId}
          group={group}
        />
      ))}
      <SearchDropdown handleSelect={handleSelect} />
    </>
  )
}

export const EditGroups = (
  props: { childId: string }
) => {
  if (!props.childId) {
    return <EditGroupsView groups={[]} />
  }

  return (
    <Query
      query={parentsByChildId}
      variables={{
        condition: {
          childId: props.childId
        }
      }}
    >
      {({ data, loading }) => {
        return loading
          ? null
          : (
            <EditGroupsView
              childId={props.childId}
              groups={
                data.allItemRelationships.nodes.map(group => ({
                  relationshipId: group.id,
                  ...group.itemByParentId
                }))
            } />
          )
      }}
    </Query>
  )
}
