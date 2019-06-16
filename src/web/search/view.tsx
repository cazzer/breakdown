import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import gql from 'graphql-tag'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import queryString from 'query-string'
import { Query } from 'react-apollo'
import React from 'react'
import { Link } from 'react-router-dom'
import { CubeLoader } from '../loading';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }
})

const ItemList = ({ items }) => (
  <List>
    {items.map(item => (
      <Link
        key={item.id}
        to={`/view/focus/${item.id}`}
      >
        <ListItem button>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ color: 'textPrimary'}}
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
          return <CubeLoader />
        }

        const results = searchResults.data.search.nodes
        if (!results.length) {
          return (
            <Typography
              color="textSecondary"
              align="center"
              variant="caption"
              paragraph={true}
            >
              Nothing here
            </Typography>
          )
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
      search: `?q=${encodeURIComponent(event.target.value)}`
    })
  }

  render() {
    const { classes } = this.props
    const query = decodeURIComponent(
      queryString.parse(this.props.location.search).q || ''
    )
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <FormControl
              fullWidth
            >
              <TextField
                autoComplete="off"
                autoFocus
                id="search"
                label="search"
                onChange={this.handleSearch}
                type="text"
                value={query}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {query.length < 2 ? (
              <Typography
                color="textSecondary"
                align="center"
                variant="caption"
                paragraph={true}
              >
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

