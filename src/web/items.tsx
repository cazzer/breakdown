import get from 'lodash/get'
import React from 'react'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import moment from 'moment'

import DeleteItem from './delete-item'
import { CubeLoader } from './loading'
import { guessType } from './focus/type-guesser'
import ValueView from './focus/value-view'
import { ItemInterface } from '../../typings'
import itemChildrenQuery from './item-children.gql'
import recentItemsQuery from './recent-items.gql'
import { SearchView } from './search/view'

const useStyles = makeStyles((theme?: Theme) =>
  createStyles({
    empty: {
      marginTop: theme.spacing(1)
    },
    listItem: {
      display: 'flex',
      flexGrow: 1
    },
    listItemLink: {
      width: '100%'
    },
    listItemActions: {
      display: 'flex',
      flexDirection: 'column'
    },
    root: {
      fontSize: '.75em',
      color: theme.palette.text.secondary
    },
    paper: {
      padding: theme.spacing(3, 2)
    }
  })
)

function ValuePreview(props: {
  value: string
}) {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <ValueView
        className={classes.root}
        value={props.value}
        preview={true}
      />
    </Paper>
  )
}

const ItemPreview = ((props: ItemInterface) => {
  const type = guessType(props.value)
  if (type === 'text') {
    return (
      <ListItemText
        primary={props.label}
        primaryTypographyProps={{ color: 'textPrimary' }}
        secondary={props.value}
        secondaryTypographyProps={{ color: 'textSecondary' }}
      />
    )
  } else {
    return (
      <>
        <ListItemText
          primary={props.label}
          primaryTypographyProps={{ color: 'textPrimary' }}
        />
        {(~['markdown', 'image'].indexOf(type))
          ? <ValuePreview value={props.value} />
          : null
        }
      </>
    )
  }
})

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
        <ListItem button className={classes.listItem} divider key={item.id}>
          <Link className={classes.listItemLink} to={`/view/focus/${item.id}`}>
            <ItemPreview label={item.label} value={item.value} />
            <Typography variant="caption" color="textSecondary">
              Edited {moment(item.timeUpdated).calendar()}
            </Typography>
          </Link>
          {item.userIsWriter && (
            <div className={classes.listItemActions}>
              <Link to={`/view/focus/${item.id}/edit`}>
                <IconButton aria-label="Focus">
                  <EditIcon />
                </IconButton>
              </Link>
              <DeleteItem id={item.id} parentId={props.parentId} />
            </div>
          )}
        </ListItem>
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

  if (loading) {
    return <CubeLoader />
  }

  return (
    <>
      {loading
        ? <CubeLoader />
        : <ItemsList
            items={
              get(data, ['allItemRelationships', 'nodes'], [])
                .map(itemRelationship => itemRelationship.itemByChildId)
            }
            parentId={props.parentId}
          />
      }
      <SearchView parentId={props.parentId} />
    </>
  )
}
