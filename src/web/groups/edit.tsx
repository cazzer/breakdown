import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import { Query } from 'react-apollo'
import parentsByChildId from './item-parents.gql'

interface GroupData {
  id: string
  label: string
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

function EditGroupsView(props) {
  const classes = useStyles()
  const [groups, setGroups] = React.useState<GroupData[]>(
    props.groups
  )

  const handleDelete = (groupToDelete: GroupData) => () => {
    setGroups(groups => groups.filter(group => group.id !== groupToDelete.key))
  }

  return (
    <>
      {groups.map(group => (
        <Chip
          key={group.id}
          label={group.label}
          onDelete={handleDelete(group)}
          className={classes.chip}
        />
      ))}
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
          : <EditGroupsView groups={
            data.allItemRelationships.nodes.map(group => group.itemByParentId)
          } />
      }}
    </Query>
  )
}
