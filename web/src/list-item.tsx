import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import UnlinkIcon from '@material-ui/icons/LinkOff'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import DeleteItem from './delete-item'
import { guessType } from './focus/type-guesser'
import ValueView from './focus/value-view'
import { ItemInterface } from '../../typings'
import { updateItemInItemChildren } from './cache-handlers'
import { updateItemMutation} from './focus/queries'
import { deleteRelationshipByIdMutation } from './groups/queries'
import { removeChildFromParent } from './cache-handlers'


const useStyles = makeStyles((theme?: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      flexGrow: 1,
      paddingRight: 0
    },
    listItemLink: {
      width: '100%',
      overflow: 'auto'
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

const useListItemStyles = makeStyles((theme?: Theme) =>
  createStyles({
    listItemButtons: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    }
  })
)

function ValuePreview(props: {
  value: string
}) {
  const classes = useStyles({})

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

const ItemEdit = (props: {
  disabled: boolean
  item: ItemInterface,
  onSaveClick: Function,
  onCancelClick: any
}) => {
  const [ label, setLabel ] = useState(props.item.label || '')
  const [ value, setValue ] = useState(props.item.value || '')
  const classes = useListItemStyles({})

  const handleChangeLabel = (event) => {
    setLabel(event.target.value)
  }

  const handleChangeValue = (event) => {
    setValue(event.target.value)
  }

  const handleSave = () => {
    props.onSaveClick({
      ...props.item,
      label,
      value
    })
  }

  return (
    <div>
      <TextField
        onChange={handleChangeLabel}
        value={label}
        fullWidth
       />
      <TextField
        onChange={handleChangeValue}
        value={value}
        fullWidth
        multiline
        rowsMax={20}
      />
      <Grid container spacing={2} className={classes.listItemButtons}>
        <Grid item xs={6}>
          <Button
            color="primary"
            fullWidth
            onClick={handleSave}
            variant="contained"
            disabled={props.disabled}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            onClick={props.onCancelClick}
            variant="outlined"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

const ItemView = (props: ItemInterface) => {
  const type = guessType(props.value)
  switch (type) {
    case 'text':
      return (
        <ListItemText
          primary={props.label}
          primaryTypographyProps={{ color: 'textPrimary' }}
          secondary={props.value}
          secondaryTypographyProps={{ color: 'textSecondary' }}
        />
      )
    case 'link':
      return (
        <ListItemText
          primary={props.label}
          primaryTypographyProps={{ color: 'textPrimary' }}
          secondary={
            <ValueView value={props.value} />
          }
          secondaryTypographyProps={{ color: 'textSecondary' }}
        />
      )
    default:
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
}

const ItemContent = ((props: {
  item: ItemInterface,
  parentId: string
}) => {
  const [ editState, setEdit ] = useState('hidden')
  const [ editItemMutation ] = useMutation(updateItemMutation, {
    update: (cache, result) => {
      setEdit('hidden')
      const { item } = result.data.updateItemById
      updateItemInItemChildren(
        cache,
        props.parentId,
        item
      )
    }
  })

  const { item } = props

  const onMouseEnter = () => {
    if (editState !== 'edit') {
      setEdit('show')
    }
  }

  const onMouseLeave = () => {
    if (editState === 'show') {
      setEdit('hidden')
    }
  }

  const onEditClick = () => {
    if (item.userIsWriter) {
      setEdit('edit')
    }
  }

  const onSaveClick = (newItem: ItemInterface) => {
    editItemMutation({
      variables: {
        itemInput: {
          id: item.id,
          itemPatch: {
            label: newItem.label,
            value: newItem.value
          }
        }
      }
    })
    setEdit('disabled')
  }

  const onCancelClick = () => {
    setEdit('hidden')
  }

  return (
    <>
        {editState === 'edit' || editState === 'disabled'
          ? (
            <ItemEdit
              disabled={editState === 'disabled'}
              item={item}
              onSaveClick={onSaveClick}
              onCancelClick={onCancelClick}
            />
          ) : (
            <div onClick={onEditClick}>
              <ItemView { ...item } />
            </div>
          )
        }
        </>
  )
})

export function Item(props: {
  item: ItemInterface,
  parentId: string
}) {
  const classes = useStyles({})
  const [deleteRelationship, deleteResult] = useMutation(deleteRelationshipByIdMutation)
  const { item } = props

  const onUnlinkClick = () => {
    deleteRelationship({
      variables: {
        relationshipInput: {
          id: props.item.relationshipId
        }
      },
      update: (proxy) => {
        removeChildFromParent(
          proxy,
          props.item.relationshipId,
          props.item.id
        )
      }
    })
  }

  const timeCreatedMoment = moment(item.timeCreated)
  const timeUpdatedMoment = moment(item.timeUpdated)
  const updatedTimeDifference =timeCreatedMoment.diff(timeUpdatedMoment)
  const timestamp = `Created ${timeCreatedMoment.calendar()}${
    updatedTimeDifference !== 0
      ? `, updated ${timeUpdatedMoment.calendar()}`
      : ''
  }`

  return (
    <ListItem divider className={classes.listItem}>
      <div className={classes.listItemLink}>
        <ItemContent
          item={item}
          parentId={props.parentId}
        />
        <Typography variant="caption" color="textSecondary">
          {timestamp}
        </Typography>
      </div>
      {item.userIsWriter && (
        <div className={classes.listItemActions}>
          <Tooltip
            arrow
            title="Expand this item's group"
            placement="left"
          >
            <Link to={`/view/focus/${item.id}/`}>
              <IconButton aria-label="Focus">
                <ZoomInIcon />
              </IconButton>
            </Link>
          </Tooltip>
          {props.item.relationshipId && (
            <Tooltip
              arrow
              title="Remove this item from this group"
              placement="left"
            >
              <IconButton onClick={onUnlinkClick}>
                <UnlinkIcon />
              </IconButton>
            </Tooltip>
          )}
          <DeleteItem id={item.id} parentId={props.parentId} />
        </div>
      )}
    </ListItem>
  )
}
