import classNames from 'classnames'
import gql from 'graphql-tag'
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
    flexBasis: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

class EditItem extends Component {
  state = {
    label: '',
    value: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleSave = () => {
    this.props.createItem({
      variables: {
        itemInput: {
          item: this.state
        }
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container>
        <Grid item xs={10} md={6}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                fullWidth
              >
                <InputLabel htmlFor="username">label</InputLabel>
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
                <InputLabel htmlFor="username">value</InputLabel>
                <Input
                  id="label"
                  onChange={this.handleChange('value')}
                  type="text"
                  value={this.state.value}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6} />
            <Grid item xs={6}>
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

const StyledEditItem = withStyles(styles)(EditItem)

const mutation = gql`
mutation($itemInput: CreateItemInput!) {
  createItem(input: $itemInput) {
    item {
      label,
      value
    }
  }
}
`

export default () => (
  <Mutation mutation={mutation}>
    {(createItemMutation) => (
      <StyledEditItem createItem={createItemMutation} />
    )}
  </Mutation>
)
