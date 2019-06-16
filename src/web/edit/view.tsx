import gql from 'graphql-tag'
import get from 'lodash/get'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import queryString from 'query-string'

import itemByIdQuery from '../focus/item-by-id.gql'
import SearchDropDown from '../search/dropdown'
import ValueView from '../focus/value-view'
import {
  addItemToAllItems,
  removeItemFromAllItems,
  updateItemInAllItems
} from '../cache-handlers'
import { null } from 'pg-sql2';

const styles = theme => ({
  content: {
    display: 'flex',
    padding: theme.spacing.unit * 2
  },
  root: {
    margin: theme.spacing.unit
  },
  labelContainer: {
    position: 'relative'
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  previewHeading: {
    margin: `${theme.spacing.unit}px 0`
  },
  preview: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit
  },
  save: {
    padding: theme.spacing.unit,
  },
})

class EditItemForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      label: '',
      value: '',
      parentId: get(props.item.itemRelationshipsByChildId, ['nodes', 0, 'itemByParentId', 'id']),
      ...props.item,
      __typename: undefined
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleParentUpdate = (parentId) => {
    this.setState({
      parentId
    })
  }

  handleSave = async () => {
    const item = {
      label: this.state.label,
      parentId: this.state.parentId,
      public: this.state.public !== null
        ? this.state.public
        : this.props.item.public,
      value: this.state.value,
    }

    this.setState({
      disabled: true
    })

    await this.props.upsert({
      variables: {
        itemInput: !this.props.new
          ? {
            id: this.props.item.id,
            itemPatch: item
          }
          : {
            item
          }
      }
    })

    this.props.onSave()
  }

  handleCheckPublic = event => {
    this.setState({
      public: event.target.checked
    })
  }

  render() {
    const { classes } = this.props
    const parent = get(this.props.item.itemRelationshipsByChildId, ['nodes', 0, 'itemByParentId'])
    return (
      <Paper className={classes.root}>
        <FormControl className={classes.content}>
          <Grid container spacing={8}>
            <Grid className={classes.labelContainer} item xs={12} md={6}>
              <InputLabel htmlFor="label">title</InputLabel>
              <Input
                autoFocus
                id="label"
                fullWidth
                onChange={this.handleChange('label')}
                type="text"
                value={this.state.label}
              />
              <TextField
                id="value"
                label="body"
                onChange={this.handleChange('value')}
                fullWidth
                multiline
                rowsMax={12}
                value={this.state.value || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className={classes.previewHeading} variant="h5">
                Preview
              </Typography>
              <Paper className={classes.preview} elevation={1}>
                <ValueView value={this.state.value} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <SearchDropDown
                onUpdate={this.handleParentUpdate}
                selectedItem={parent}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                Permissions
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.public !== null ? this.state.public : this.props.item.public}
                    onChange={this.handleCheckPublic}
                  />
                }
                label="Public"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                disabled={this.state.disabled}
                fullWidth
                onClick={this.handleSave}
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
}

const StyledEditItem = withStyles(styles)(EditItemForm)

const createItem = gql`
mutation createItem($itemInput: CreateItemInput!) {
  createItem(input: $itemInput) {
    item {
      id,
      label,
      parentId,
      value,
      itemByParentId {
        id,
        label
      }
    }
  }
}
`

export const CreateItem = (props) => (
  <Mutation
    mutation={createItem}
    update={(cache, result) => {
      const { item } = result.data.createItem
      addItemToAllItems(cache, item, item.parentId)
    }}
  >
    {(createItemMutation) => (
      <StyledEditItem
        item={props.item}
        upsert={createItemMutation}
        new
        onSave={props.onSave}
        {...props}
      />
    )}
  </Mutation>
)

export const CreateItemView = (props) => {
  const query = queryString.parse(props.location.search)

  if (query.parentId) {
    return (
      <Query
        query={itemByIdQuery}
        variables={{
          id: query.parentId
        }}
      >
        {({ data, loading }) => {
          return loading
            ? null
            : (
              <CreateItem
                item={{ itemByParentId: data.itemById }}
                onSave={props.history.goBack}
              />
            )
        }}
      </Query>
    )
  }

  return <CreateItem onSave={props.history.goBack} />
}

const updateItem = gql`
mutation updateItem($itemInput: UpdateItemByIdInput!) {
  updateItemById(input: $itemInput) {
    item {
      id,
      label,
      parentId,
      public,
      value,
      itemByParentId {
        id,
        label
      }
    }
  }
}
`

export const EditItem = (props) => (
  <Mutation
    mutation={updateItem}
    update={(cache, result) => {
      const oldParentId = get(props, ['item', 'itemByParentId', 'id'], null)
      const { item } = result.data.updateItemById

      if (oldParentId === item.parentId) {
        updateItemInAllItems(cache, item, item.parentId)
      } else {
        removeItemFromAllItems(cache, item, oldParentId)
        addItemToAllItems(cache, item, item.parentId)
      }
    }}
  >
    {(editItemMutation) => (
      <StyledEditItem
        item={props.item}
        onSave={props.onSave}
        upsert={editItemMutation}
      />
    )}
  </Mutation>
)

export const EditItemView = (props) => (
  <Query
    query={itemByIdQuery}
    variables={{
      id: get(props.match.params, 'itemId')
    }}
  >
    {({ data, loading}) => {
     return loading
        ? null
        : <EditItem item={data.itemById} onSave={props.history.goBack} />
    }}
  </Query>
)
