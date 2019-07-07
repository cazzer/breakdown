import gql from 'graphql-tag'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useQuery, useMutation } from 'react-apollo'
import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import { CubeLoader } from '../loading'
import createItemMutation from '../edit/create-item.gql'
import { addToRecentItems } from '../cache-handlers'

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  margin: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
})

const searchItems = gql`
query Search($input: String!) {
  search(term: $input) {
    nodes {
      id,
      label
    }
  }
}
`

const ConnectedItemList = (
  props: { query: String }
) => {
  const { data, loading } = useQuery(searchItems, {
    variables: {
      input: props.query
    },
  })

  if (loading) {
    return <CubeLoader />
  }

  if (!data.search.nodes.length) {
      <Typography
        color="textSecondary"
        variant="caption"
      >
        No results found
      </Typography>
  }

  return data.search.nodes.map(item => (
    <ListItem
      button
      key={item.id}
      onClick={props.handleItemClick(item)}
    >
      <ListItemText
        primary={item.label}
      />
    </ListItem>
  ))
}

const Dropdown = ({
  anchorElement,
  handleItemClick,
  isOpen,
  query
}) => (
  <Popper
    anchorEl={anchorElement}
    open={isOpen}
    style={{ width: anchorElement.clientWidth }}
  >
    <Paper>
      <List>
        {
          query.length &&
            <ListItem
              button
              key="new"
              onClick={handleItemClick({label: query})}
            >
              <ListItemText primary={query} />
            </ListItem>
        }
        <Divider />
        {
          query.length > 2
            ? <ConnectedItemList handleItemClick={handleItemClick} query={query} />
            : (
              <Typography
                color="textSecondary"
                variant="caption"
              >
                Type more to search
              </Typography>
            )
        }
      </List>
    </Paper>
  </Popper>
)

function Search(props) {
  const [state, setState] = useState({
    anchorElement: null,
    isOpen: false,
    query: '',
    selectedItem: props.selectedItem
  })
  const [createItem, { error, loading }] = useMutation(createItemMutation)

  const handleItemClick = item => () => {
    setState({
      query: ''
    })

    if (item.id) {
      return props.handleSelect(item)
    }

    createItem({
      variables: {
        itemInput: {
          item: {
            label: item.label
          }
        }
      },
      update: (proxy, mutationResult) => {
        const newItem = mutationResult.data.createItem.item
        addToRecentItems(proxy, newItem)
        props.handleSelect(newItem)
      }
    })
  }

  const handleSearch = event => {
    setState({
      anchorElement: event.target,
      query: event.target.value
    })
  }

  return (
    <>
      <TextField
        autoComplete="off"
        autoFocus
        id="search"
        onChange={handleSearch}
        onFocus={handleSearch}
        type="text"
        value={state.query}
        disabled={loading}
      />
      {
        state.anchorElement &&
        state.query &&
        !loading &&
        <Dropdown
          anchorElement={state.anchorElement}
          handleItemClick={handleItemClick}
          isOpen={true}
          query={state.query}
        />
      }
    </>
  )
}

export default withStyles(styles)(Search)
