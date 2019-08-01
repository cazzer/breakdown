
import React from 'react'
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import DeleteItem from './delete-item'
import { guessType } from './focus/type-guesser'
import ValueView from './focus/value-view'
import { ItemInterface } from '../../typings'

const useStyles = makeStyles((theme?: Theme) =>
  createStyles({
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
})

export function Item(props: {
  item: ItemInterface
}) {
  const classes = useStyles()
  const { item } = props

  return (
    <ListItem className={classes.listItem} divider key={item.id}>
      <div className={classes.listItemLink}>
        <ItemPreview label={item.label} value={item.value} />
        <Typography variant="caption" color="textSecondary">
          Edited {moment(item.timeUpdated).calendar()}
        </Typography>
      </div>
      {item.userIsWriter && (
        <div className={classes.listItemActions}>
          <Link to={`/view/focus/${item.id}/`}>
            <IconButton aria-label="Focus">
              <ZoomInIcon />
            </IconButton>
          </Link>
          <DeleteItem id={item.id} parentId={props.parentId} />
        </div>
      )}
    </ListItem>
  )
}
