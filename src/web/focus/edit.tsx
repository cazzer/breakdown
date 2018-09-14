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

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 4
  },
  root: {
    margin: theme.spacing.unit
  },
  title: {
  }
})

class FocusEditView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      label: props.item.label,
      value: props.item.value
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
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

  render() {
    const { classes, editItem } = this.props

    return (
      <Paper className={classes.root}>
        <Grid container className={classes.content}>
          <FormControl fullWidth>
            <Grid className={classes.title} item xs={12} xl={4}>
              <TextField
                id="label"
                label="label"
                fullWidth
                onChange={this.handleChange('label')}
                value={this.state.label}
              />
            </Grid>
            <Grid className={classes.title} item xs={12} xl={8}>
              <TextField
                id="value"
                label="value"
                fullWidth
                multiline
                onChange={this.handleChange('value')}
                rowsMax={12}
                value={this.state.value}
              />
            </Grid>
            <Grid item xs={12}>
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

const itemQuery = gql`
query Item($id: UUID!) {
  itemById(id: $id) {
    id
    label
    value
  }
}
`

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
    query={itemQuery}
    variables={{
      id: get(props.match.params, 'itemId')
    }}
  >
    {(itemQuery => (
      itemQuery.loading
        ? null
        : <MutatedItem item={itemQuery.data.itemById} {...props} />
    ))}
  </Query>
)
