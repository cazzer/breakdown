import get from 'lodash/get'
import React from 'react'
import { useQuery } from 'react-apollo'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'

import { Item } from './list-item'
import { CubeLoader } from './loading'
import { ItemInterface } from '../../typings'
import {
  ItemChildren as itemChildrenQuery,
  RecentItems as recentItemsQuery
} from './focus/item-by-id.gql'
import { SearchView } from './search/view'

const useStyles = makeStyles((theme?: Theme) =>
  createStyles({
    empty: {
      marginTop: theme.spacing(1)
    }
  })
)

function ItemsList(props: {
  items: Array<ItemInterface>
  parentId?: string
}) {
  const items = props.items.filter(item => !!item)
  const classes = useStyles()

  if (!items.length) {
    return (
      <div className={classes.empty}>
        <Typography
          color="textSecondary"
          align="center"
          variant="caption"
          paragraph={true}
        >
          this group has no items in it
        </Typography>
      </div>
    )
  }

  return (
    <List>
      {items.map(item => (
        <Item item={item} parentId={props.parentId} key={item.id} />
      ))}
    </List>
  )
}

export function RecentItemList() {
  const { data, error, loading } = useQuery(recentItemsQuery)

  if (loading) {
    return <CubeLoader />
  }

  return <ItemsList items={data.allItems.nodes} />
}

export default function(
  props: { parentId: string }
) {
  const { data, loading } = useQuery(itemChildrenQuery, {
    variables: {
      condition: {
        parentId: props.parentId
      }
    },
  })

  const items = get(data, ['allItemRelationships', 'nodes'], [])
    .map(itemRelationship => ({
      ...itemRelationship.itemByChildId,
      relationshipId: itemRelationship.id
    }))

  if (loading && !data) {
    return <CubeLoader />
  }

  return (
    <>
      <ItemsList
        items={items}
        parentId={props.parentId}
      />
      <SearchView parentId={props.parentId} />
    </>
  )
}
