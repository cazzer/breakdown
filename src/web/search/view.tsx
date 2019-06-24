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
import { Query, useMutation } from 'react-apollo'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CubeLoader } from '../loading'
import CreateNewItem from './create-new-item'
import createRelationshipMutation from '../groups/create-relationship-mutation.gql'
import { addItemToAllItems } from '../cache-handlers'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1)
  },
  search: {
    fontSize: theme.typography.h2.fontSize
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

  handleCreateNew = newItem => {
    this.props.history.push(`view/focus/${newItem.id}`)
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
                inputProps={{ className: classes.search }}
                value={query}
              />
            </FormControl>
          </Grid>
          {query.length ? (
            <>
              <Grid item xs={6}>
                <Typography color="textSecondary">
                  something new
                </Typography>
                <CreateNewItem label={query} onCreate={this.handleCreateNew} />
              </Grid>
              <Grid item xs={6}>
                {query.length < 2 ? (
                  <Typography
                    color="textSecondary"
                    align="center"
                    variant="caption"
                    paragraph={true}
                  >
                    keep typing to search
                  </Typography>
                ) : (
                  <>
                    <Typography color="textSecondary">
                      search results
                    </Typography>
                    <ConnectedItemList term={query} />
                  </>
                )}
              </Grid>
            </>
          )
          : (
            <Grid item xs={12}>
              <Typography
                color="textSecondary"
                align="center"
                variant="caption"
                paragraph={true}
              >
                what are you looking for?
              </Typography>
            </Grid>
          )}

        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Search)

function StatefulSearch(props) {
  const [query, setQuery] = useState('')
  const [createRelationship, { data, loading }] = useMutation(createRelationshipMutation)

  const handleSearch = (event) => {
    setQuery(event.target.value)
  }

  const handleCreateNew = (newItem) => {
    createRelationship({
      variables: {
        relationshipInput: {
          itemRelationship: {
            childId: newItem.id,
            parentId: props.parentId
          }
        }
      },
      update: (proxy, result) => {
        addItemToAllItems(proxy, {
          ...result.data.createItemRelationship.itemRelationship,
          itemByChildId: newItem
        }, props.parentId)
        setQuery('')
      }
    })
  }

  return (
    <div className={props.classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <FormControl
            fullWidth
          >
            <TextField
              autoComplete="off"
              id="search"
              label="search"
              onChange={handleSearch}
              type="text"
              inputProps={{ className: props.classes.search }}
              value={query}
            />
          </FormControl>
        </Grid>
        {query.length ? (
          <>
            <Grid item xs={12}>
              <Typography color="textSecondary">
                something new
              </Typography>
              <CreateNewItem label={query} onCreate={handleCreateNew} />
            </Grid>
          </>
        )
        : (
          <Grid item xs={12}>
            <Typography
              color="textSecondary"
              align="center"
              variant="caption"
              paragraph={true}
            >
              add an item to this group
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export const SearchView = withStyles(styles)(StatefulSearch)

