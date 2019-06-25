import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import uuidv4 from 'uuid/v4'
import { useMutation, useQuery } from 'react-apollo'
import parentsByChildId from './item-parents.gql'
import SearchDropdown from '../search/dropdown'
import createRelationshipMutation from './create-relationship-mutation.gql'
import deleteRelationshipMutation from './delete-relationship-mutation.gql'
import {
  addParentToChild,
  removeParentFromChild
} from '../cache-handlers'

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
  group: GroupData,
  isNew?: boolean,
  onDelete?: Function
}) {
  const classes = useStyles()
  const [deleteRelationship, deleteResult] =
    useMutation(deleteRelationshipMutation)

  const handleDelete = () => () => {
    if (props.onDelete) {
      return props.onDelete(props.group)
    }

    deleteRelationship({
      variables: {
        relationshipInput: {
          id: props.group.relationshipId
        }
      },
      update: (proxy) => {
        removeParentFromChild(
          proxy,
          props.group.relationshipId,
          props.childId
        )
      }
    })
  }

  return (
    <Chip
      className={classes.chip}
      clickable={!deleteResult.called}
      label={props.group.label}
      onDelete={handleDelete()}
      variant={deleteResult.called || props.isNew ? 'outlined' : 'default'}
    />
  )
}

function EditGroupsView(props) {
  const [newGroups, setGroups] = useState([])
  const [addRelationship, addResult] = useMutation(createRelationshipMutation)

  function addRelationshipHandler(groupToAdd: GroupData) {
    addRelationship({
      variables: {
        relationshipInput: {
          itemRelationship: {
            childId: props.childId,
            parentId: groupToAdd.id
          }
        }
      },
      update: (proxy, addResult) => {
        addParentToChild(proxy, {
          ...addResult.data.createItemRelationship.itemRelationship,
          itemByParentId: groupToAdd
        }, props.childId)
      }
    })
  }

  const handleDelete = (oldGroup: GroupData) => {
    setGroups(newGroups.filter(group => group.id !== oldGroup.id))
  }

  const handleSelect = (groupToAdd: GroupData) => {
    if (!props.childId) {
      setGroups([
        ...newGroups,
        groupToAdd
      ])
    } else {
      addRelationshipHandler(groupToAdd)
    }
  }

  if (props.childId && newGroups.length) {
    console.log('do something!')
  }

  return (
    <>
      {props.groups.map((group: GroupData) => (
        <EditGroupView
          childId={props.childId}
          key={group.relationshipId}
          group={group}
        />
      ))}
      {newGroups.map((group: GroupData) => (
        <EditGroupView
          childId={props.childId}
          key={group.id}
          group={group}
          isNew={true}
          onDelete={handleDelete}
        />
      ))}
      <SearchDropdown handleSelect={handleSelect} />
    </>
  )
}

export function EditGroups(
  props: { childId: string }
) {
  if (!props.childId) {
    return <EditGroupsView groups={[]} />
  }

  const { data, loading } = useQuery(parentsByChildId, {
    variables: {
      condition: {
        childId: props.childId
      }
    },
  })

  if (loading) {
    return null
  }

  return (
    <EditGroupsView
      childId={props.childId}
      groups={
        data.allItemRelationships.nodes.map(group => ({
          relationshipId: group.id,
          ...group.itemByParentId
        }))
    } />
  )
}
