import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import gql from 'graphql-tag'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import queryString from 'query-string'
import { Query } from 'react-apollo'
import React from 'react'
import { Link } from 'react-router-dom'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
})

const ItemList = ({ items }) => (
  <List>
    {items.map(item => (
      <Link
        key={item.id}
        to={`/home/${item.parentId || 'root'}/${item.id}`}
      >
        <ListItem button>
          <ListItemText
            primary={item.label}
            secondary={item.value}
          />
        </ListItem>
      </Link>
    ))}
  </List>
)

const searchItems = gql`
query Search($input: String!) {
  search(term: $input) {
    nodes {
      id,
      label,
      parentId,
      value
    }
  }
}
`

const ConnectedItemList = ({ term }) => {
  return (
    <Query
      query={searchItems}
      variables={{
        input: term
      }}
    >
      {(searchResults) => {
        if (searchResults.loading) {
          return <Typography>Loading...</Typography>
        }

        const results = searchResults.data.search.nodes
        if (!results.length) {
          return <Typography>Nothing to see here.</Typography>
        }

        return <ItemList items={results} />
      }}
    </Query>
  )
}

class Search extends React.Component {
  handleSearch = event => {
    this.props.history.replace({
      pathname: this.props.location.pathname,
      search: `?q=${event.target.value}`
    })
  }

  render() {
    const { classes } = this.props
    const query = queryString.parse(this.props.location.search).q || ''
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <FormControl
              className={classes.margin}
              fullWidth
            >
              <InputLabel htmlFor="search">Search</InputLabel>
              <Input
                id="search"
                onChange={this.handleSearch}
                type="text"
                value={query}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {query.length < 2 ? (
              <Typography>
                Start typing to start searching...
              </Typography>
            ) : (
              <ConnectedItemList term={query} />
            )}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Search)

