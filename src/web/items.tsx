import gql from 'graphql-tag'
import get from 'lodash/get'
import { withStyles } from '@material-ui/core'
import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'

import DeleteItem from './delete-item'
import { CubeLoader } from './loading'
import { guessType } from './focus/type-guesser'
import ValueView from './focus/value-view'
import { ItemInterface } from '../../typings'
import itemChildrenQuery from './item-children.gql'

const styles = theme => ({
  empty: {
    marginTop: theme.spacing(1)
  },
  root: {
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
  }
})

const ValuePreview = withStyles(theme => ({
  root: {
    fontSize: '.75em',
    color: theme.palette.text.secondary
  }
}))(({ classes, value }) => (
  <ValueView className={classes.root} value={value} preview={true} />
))

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
      <div>
        <ListItemText
          primary={props.label}
          primaryTypographyProps={{ color: 'textPrimary' }}
        />
        {(~['markdown', 'image'].indexOf(type))
          ? <ValuePreview value={props.value} />
          : null
        }
      </div>
    )
  }
})

const ItemsList = (props: {
  classes: Object,
  items: Array<ItemInterface>
}) => {
  const { classes, items } = props

  if (!items.length) {
    return (
    <div className={classes.empty}>
      <Typography
        color="textSecondary"
        align="center"
        variant="caption"
        paragraph={true}
      >
        Nothing here
      </Typography>
    </div>
    )
  }

  return (
    <div className={classes.root}>
      <List>
        {items.map(item => (
          <ListItem button className={classes.listItem} divider key={item.id}>
            <Link className={classes.listItemLink} to={`/view/focus/${item.id}`}>
              <ItemPreview label={item.label} value={item.value} />
            </Link>
            <div className={classes.listItemActions}>
              <Link to={`/view/focus/${item.id}/edit`}>
                <IconButton aria-label="Focus">
                  <EditIcon />
                </IconButton>
              </Link>
              <DeleteItem id={item.id} parentId={item.parentId} />
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

const StyledItemsList = withStyles(styles)(ItemsList)

export default (
  props: { parentId: String }
) => (
  <Query
    variables={{
      condition: {
        parentId: (props.parentId !== 'root') ? props.parentId : null
      }
    }}
    query={itemChildrenQuery}
  >
    {({ loading, data }) => (
      loading
        ? <CubeLoader />
        : <StyledItemsList items={
          get(data, ['allItemRelationships', 'nodes'], [])
            .map(itemRelationship => itemRelationship.itemByChildId)
        } />
    )}
  </Query>
)
