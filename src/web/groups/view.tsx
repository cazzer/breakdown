import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import { Query } from 'react-apollo'
import parentsByChildId from './item-parents.gql'

interface GroupData {
  id: string
  label: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      margin: theme.spacing.unit
    }
  })
)

function GroupsView(
  props: { groups: GroupData[] }
) {
  const classes = useStyles()

  return (
    <>
      {props.groups.map(group => (
        <Link to={`/view/focus/${group.id}`}>
          <Button variant="outlined" className={classes.backButton}>
            <ArrowUpward />
            {group.label}
          </Button>
        </Link>
      ))}
    </>
  )
}

export const Groups = (
  props: { childId: string }
) => (
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
        : <GroupsView groups={
          data.allItemRelationships.nodes.map(group => group.itemByParentId)
        } />
    }}
  </Query>
)
