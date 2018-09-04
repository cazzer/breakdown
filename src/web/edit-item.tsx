import classNames from 'classnames'
import gql from 'graphql-tag'
import get from 'lodash/get'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'

import { allItemsQuery } from './items'
import SearchDropDown from './search/dropdown'

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

  handleParentUpdate = (parentId) => {
    this.setState({
      parentId
    })
  }

  handleSave = () => {
    this.props.upsert({
      variables: {
        itemInput: get(this.props, ['oldItem', 'id']) ? {
          id: this.props.oldItem.id,
          itemPatch: this.state
        }: {
          item: {
            ...this.props.oldItem,
            ...this.state
          }
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
                className={classNames(classes.textField)}
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
                className={classNames(classes.textField)}
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
            <Grid item xs={6} sm={8} md={9} lg={10} xl={11}>
              <SearchDropDown
                onUpdate={this.handleParentUpdate}
                selectedItem={get(this.props.oldItem, 'itemByParentId')}
              />
            </Grid>
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
mutation createItem($itemInput: CreateItemInput!) {
  createItem(input: $itemInput) {
    item {
      id,
      label,
      parentId,
      value
    }
  }
}
`

export const CreateItem = (props) => (
  <Mutation
    mutation={createItem}
    update={(cache, result) => {
      const data = cache.readQuery({
        query: allItemsQuery,
        variables: {
          condition: {
            parentId: get(props, ['oldItem', 'parentId'])
          }
        }
      })
      cache.writeQuery({
        query: allItemsQuery,
        variables: {
          condition: {
            parentId: get(props, ['oldItem', 'parentId'])
          }
        },
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
      <StyledEditItem upsert={createItemMutation} {...props} />
    )}
  </Mutation>
)

const updateItem = gql`
mutation updateItem($itemInput: UpdateItemByIdInput!) {
  updateItemById(input: $itemInput) {
    item {
      label,
      parentId,
      value
    }
  }
}
`

export const EditItem = (props) => (
  <Mutation
    mutation={updateItem}
    update={(cache, result) => {
      const oldParentId = get(props.oldItem, 'parentId')
      const newParentId = result.data.updateItemById.item.parentId
      const oldParentItems = cache.readQuery({
        query: allItemsQuery,
        variables: {
          condition: {
            parentId: oldParentId
          }
        }
      })

      if (newParentId === oldParentId) {
        cache.writeQuery({
          query: allItemsQuery,
          variables: {
            condition: {
              parentId: oldParentId
            }
          },
          data: {
            allItems: {
              ...oldParentItems.allItems,
              nodes: oldParentItems.allItems.nodes.map(item => (
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
      } else {
        cache.writeQuery({
          query: allItemsQuery,
          variables: {
            condition: {
              parentId: oldParentId
            }
          },
          data: {
            allItems: {
              ...oldParentItems.allItems,
              nodes: oldParentItems.allItems.nodes.filter(item => (
                item.id !== props.oldItem.id
              ))
            }
          }
        })

        const newParentItems = cache.readQuery({
          query: allItemsQuery,
          variables: {
            condition: {
              parentId: newParentId
            }
          }
        })

        cache.writeQuery({
          query: allItemsQuery,
          variables: {
            condition: {
              parentId: newParentId
            }
          },
          data: {
            allItems: {
              ...newParentItems.allItems,
              nodes: [
                result.data.updateItemById.item,
                ...newParentItems.allItems.nodes
              ]
            }
          }
        })
      }
    }}
  >
    {(editItemMutation) => (
      <StyledEditItem upsert={editItemMutation} {...props} />
    )}
  </Mutation>
)
