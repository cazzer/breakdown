import get from 'lodash/get'
import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import queryString from 'query-string'

import TypeGuesser from './type-guesser'
import itemByIdQuery from './item-by-id.gql'
import SearchDropDown from '../search/dropdown'

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 4
  },
  root: {
    margin: theme.spacing.unit
  },
  title: {
  },
  save: {
    padding: theme.spacing.unit
  }
})

class FocusEditView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      autoFocusOnValue: false,
      label: get(props, ['item', 'label'], ''),
      value: get(props, ['item', 'value'], '')
    }

    if (props.new && props.parentItem) {
      this.state = {
        parentId: props.parentItem.id,
        ...this.state
      }
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      autoFocusOnValue: true
    })
  }

  handleEdit = async () => {
    await this.props.editItem({
      variables: {
        itemInput: {
          id: this.props.item.id,
          itemPatch: {
            label: this.state.label,
            value: this.state.value
          }
        }
      }
    })

    this.props.history.goBack()
  }

  handleParentUpdate = (parentId) => {
    this.setState({
      parentId
    })
  }

  render() {
    const { classes } = this.props

    return (
      <Paper className={classes.root}>
        <Grid container className={classes.content}>
          <FormControl fullWidth>
            <Grid className={classes.title} item xs={12} xl={4}>
              <TextField
                id="label"
                label="label"
                autoFocus={!this.state.autoFocusOnValue}
                fullWidth
                onChange={this.handleChange('label')}
                value={this.state.label}
              />
            </Grid>
            <Grid className={classes.title} item xs={12} xl={8}>
              <TypeGuesser
                autoFocus={this.state.autoFocusOnValue}
                changeValue={this.handleChange('value')}
                value={this.state.value}
              />
            </Grid>
            <Grid item xs={12}>
              <SearchDropDown
                onUpdate={this.handleParentUpdate}
                selectedItem={
                  this.props.parentItem
                  || get(this.props, ['item', 'itemByParentId'])
                }
              />
            </Grid>
            <Grid className={classes.save} item xs={12}>
              <Button
                className={classes.button}
                color="primary"
                fullWidth
                onClick={this.handleEdit}
                size="large"
                variant="contained"
              >
                Save
              </Button>
            </Grid>
          </FormControl>
        </Grid>
      </Paper>
    )
  }
}

const StyledFocusView = withStyles(styles)(FocusEditView)

const AddItemView = (props) => {
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
            : <StyledFocusView new={query.new} parentItem={data.itemById} />
        }}
      </Query>
    )
  }

  return <StyledFocusView { ...props} />
}

export { AddItemView }

const editItemMutation = gql`
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

const MutatedItem = (props) => (
  <Mutation
    mutation={editItemMutation}
  >
    {(editItem) => (
      <StyledFocusView
        editItem={editItem}
        {...props}
      />
    )}
  </Mutation>
)

export default (props) => (
  <Query
    query={itemByIdQuery}
    variables={{
      id: get(props.match.params, 'itemId')
    }}
  >
    {(itemQuery => {
     return itemQuery.loading
        ? null
        : <MutatedItem item={itemQuery.data.itemById} {...props} />
    })}
  </Query>
)
