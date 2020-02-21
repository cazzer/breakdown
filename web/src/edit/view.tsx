import gql from 'graphql-tag'
import get from 'lodash/get'
import React, { Component, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import queryString from 'query-string'
import uuidv4 from 'uuid/v4'

import { itemByIdQuery } from '../focus/queries'
import ValueView from '../focus/value-view'
import {
  addItemToAllItems,
  removeItemFromAllItems,
  updateItemInAllItems
} from '../cache-handlers'
import { EditGroups } from '../groups/edit'
import createItem from './create-item'
import { CubeLoader } from '../loading'
import EditPermissions from '../permissions/edit'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: 'flex',
      padding: theme.spacing(2)
    },
    root: {
      margin: theme.spacing(1)
    },
    labelContainer: {
      position: 'relative'
    },
    margin: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    previewHeading: {
      margin: `${theme.spacing(1)}px 0`
    },
    preview: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1)
    },
    save: {
      padding: theme.spacing(1)
    },
  })
)

function EditItemForm(props) {
  const [state, setState] = useState({
    id: uuidv4(),
    label: '',
    value: '',
    public: false,
    ...props.item,
    __typename: undefined
  })

  const handleChange = name => event => {
    setState({
      [name]: event.target.value,
    })
  }

  const handleSave = async () => {
    const item = {
      label: state.label,
      public: state.public !== null
        ? state.public
        : props.item.public,
      value: state.value,
    }

    setState({
      disabled: true
    })

    await props.upsert({
      variables: {
        itemInput: !props.isNew
          ? {
            id: props.item.id,
            itemPatch: item
          }
          : {
            item
          }
      }
    })
  }

  const handleCheckPublic = event => {
    setState({
      public: event.target.checked
    })
  }

  const classes = useStyles({})
  const permissions = get(props.item, ['permissionsByItemId', 'nodes'], [])
    .map(permission => ({
      id: permission.id,
      itemId: permission.itemId,
      role: permission.role,
      timeCreated: permission.timeCreated,
      userOrGroup: permission.usersAndGroupByUserOrGroupId
    }))

  return (
    <Paper className={classes.root}>
      <FormControl className={classes.content}>
        <Grid container spacing={8}>
          <Grid className={classes.labelContainer} item xs={12} md={6}>
            <TextField
              autoFocus
              id="label"
              label="label"
              fullWidth
              onChange={handleChange('label')}
              type="text"
              value={state.label}
            />
            <TextField
              id="value"
              label="body"
              onChange={handleChange('value')}
              fullWidth
              multiline
              rowsMax={12}
              value={state.value || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.previewHeading} variant="h5">
              Preview
            </Typography>
            <Paper className={classes.preview} elevation={1}>
              <ValueView value={state.value} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.previewHeading} variant="h5">
              Groups
            </Typography>
            <EditGroups childId={get(props, ['item', 'id'])} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">
              Permissions
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.public !== null ? state.public : props.item.public}
                  onChange={handleCheckPublic}
                />
              }
              label="Public"
            />
            <EditPermissions
              itemId={props.item.id}
              permissions={permissions}
              public={props.item.public}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              disabled={state.disabled}
              fullWidth
              onClick={handleSave}
              size="large"
              variant="contained"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </Paper>
  )
}

export function CreateItem(props) {
  const [createItemMutation] = useMutation(createItem, {
    update: (cache, result) => {
      const { item } = result.data.createItem
      addItemToAllItems(cache, item, item.parentId)
    }
  })

  return (
    <EditItemForm
      item={props.item}
      upsert={createItemMutation}
      isNew
      onSave={props.onSave}
      {...props}
    />
  )
}

export function CreateItemView(props) {
  const query = queryString.parse(props.location.search)

  if (!query.parentId) {
    return <CreateItem onSave={props.history.goBack} />
  }

  const { data, loading } = useQuery(itemByIdQuery, {
    variables: {
      id: query.parentId
    },
  })

  return loading && !data
    ? <CubeLoader />
    : (
      <CreateItem
        item={{ itemByParentId: data.itemById }}
      />
    )
}

const updateItem = gql`
mutation updateItem($itemInput: UpdateItemByIdInput!) {
  updateItemById(input: $itemInput) {
    item {
      id,
      label,
      parentId,
      public,
      value
    }
  }
}
`

export function EditItem(props) {
  const [editItemMutation] = useMutation(updateItem, {
    update: (cache, result) => {
      const { item } = result.data.updateItemById

      updateItemInAllItems(cache, item)
    }
  })

  return (
    <EditItemForm
      item={props.item}
      onSave={props.onSave}
      upsert={editItemMutation}
    />
  )
}

export function EditItemView(props) {
  const { data, loading } = useQuery(itemByIdQuery, {
    variables: {
      id: get(props.match.params, 'itemId')
    },
  })

  return loading && !data
    ? null
    : <EditItem item={data.itemById} onSave={props.history.goBack} />
}
