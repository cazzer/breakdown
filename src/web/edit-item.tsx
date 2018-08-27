import classNames from 'classnames'
import gql from 'graphql-tag'
import { get } from 'lodash'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  FormControl,
  Grid,
  Input,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  Paper
} from '@material-ui/core'

import { allItemsQuery } from './items'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
  },
  button: {
    margin: theme.spacing.unit,
  },
})

class EditItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      label: get(props, ['oldItem', 'label'], ''),
      value: get(props, ['oldItem', 'value'], ''),
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleSave = () => {
    this.props.upsert({
      variables: {
        itemInput: get(this.props, ['oldItem', 'id']) ? {
          id: this.props.oldItem.id,
          itemPatch: this.state
        }: {
          item: this.state
        }
      }
    })

    if (!get(this.props, ['oldItem', 'id'])) {
      this.setState({
        label: '',
        value: ''
      })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                fullWidth
              >
                <InputLabel htmlFor="label">label</InputLabel>
                <Input
                  id="label"
                  onChange={this.handleChange('label')}
                  type="text"
                  value={this.state.label}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                fullWidth
              >
                <TextField
                  id="value"
                  label="value"
                  onChange={this.handleChange('value')}
                  multiline
                  rowsMax={6}
                  value={this.state.value}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6} sm={8} md={9} lg={10} xl={11} />
            <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
              <Button
                className={classes.button}
                color="primary"
                fullWidth
                onClick={this.handleSave}
                size="large"
                variant="contained"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const StyledEditItem = withStyles(styles)(EditItemForm)

const createItem = gql`
mutation($itemInput: CreateItemInput!) {
  createItem(input: $itemInput) {
    item {
      id,
      label,
      value
    }
  }
}
`

export const CreateItem = () => (
  <Mutation
    mutation={createItem}
    update={(cache, result) => {
      const data = cache.readQuery({
        query: allItemsQuery
      })
      cache.writeQuery({
        query: allItemsQuery,
        data: {
          allItems: {
            ...data.allItems,
            nodes: [
              result.data.createItem.item,
              ...data.allItems.nodes
            ]
          }
        }
      })
    }}
  >
    {(createItemMutation) => (
      <StyledEditItem upsert={createItemMutation} />
    )}
  </Mutation>
)

const updateItem = gql`
mutation updateItem($itemInput: UpdateItemByIdInput!) {
  updateItemById(input: $itemInput) {
    item {
      label,
      value
    }
  }
}
`

export const EditItem = (props) => (
  <Mutation
    mutation={updateItem}
    update={(cache, result) => {
      const data = cache.readQuery({
        query: allItemsQuery
      })
      cache.writeQuery({
        query: allItemsQuery,
        data: {
          allItems: {
            ...data.allItems,
            nodes: data.allItems.nodes.map(item => (
              item.id === props.oldItem.id
                ? {
                   ...item,
                   ...result.data.updateItemById.item
                }
                : item
            ))
          }
        }
      })
    }}
  >
    {(editItemMutation) => (
      <StyledEditItem upsert={editItemMutation} {...props} />
    )}
  </Mutation>
)
