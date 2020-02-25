import gql from 'graphql-tag'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useQuery, useMutation } from 'react-apollo'
import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import { CubeLoader } from '../loading'
import createItemMutation from '../edit/create-item'
import { addToRecentItems } from '../cache-handlers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    margin: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  })
)

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

const searchUsers = gql`
query SearchUsers($input: String!) {
  searchUsers(term: $input) {
    nodes {
      id,
      name
    }
  }
}
`

const ConnectedItemList = (
  props: {
    handleItemClick: Function,
    query: String
  }
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

const ConnectedUserList = (
  props: {
    handleItemClick: Function,
    query: String
  }
) => {
  const { data, loading } = useQuery(searchUsers, {
    variables: {
      input: props.query
    },
  })

  if (loading) {
    return <CubeLoader />
  }

  if (!data.searchUsers.nodes.length) {
      <Typography
        color="textSecondary"
        variant="caption"
      >
        No results found
      </Typography>
  }

  return data.searchUsers.nodes.map(userOrGroup => (
    <ListItem
      button
      key={userOrGroup.id}
      onClick={props.handleItemClick(userOrGroup)}
    >
      <ListItemText
        primary={userOrGroup.name}
      />
    </ListItem>
  ))
}

const Dropdown = ({
  allowNew = true,
  source = 'items',
  anchorElement,
  handleItemClick,
  isOpen,
  query
}) => (
  <Popper
    anchorEl={anchorElement}
    open={isOpen}
    style={{
      width: anchorElement.clientWidth,
      zIndex: 10
    }}
  >
    <Paper>
      <List>
        {
          allowNew && query.length &&
            <>
              <ListItem
                button
                key="new"
                onClick={handleItemClick({label: query})}
              >
                <ListItemText primary={query} />
              </ListItem>
              <Divider />
            </>
        }
        {
          query.length > 2
            ? source === 'items'
              ? <ConnectedItemList handleItemClick={handleItemClick} query={query} />
              : <ConnectedUserList handleItemClick={handleItemClick} query={query} />
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

export default function Search(props: {
  allowNew?: boolean,
  autoFocus?: boolean,
  handleSelect: Function,
  selectedItem?: any,
  source?: string
}) {
  const [state, setState] = useState({
    anchorElement: null,
    isOpen: false,
    query: '',
    selectedItem: props.selectedItem
  })
  const [createItem, { error, loading }] = useMutation(createItemMutation)

  const handleItemClick = item => () => {
    setState({
      ...state,
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
      ...state,
      anchorElement: event.target,
      query: event.target.value
    })
  }

  return (
    <>
      <TextField
        autoComplete="off"
        autoFocus={props.autoFocus}
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
          allowNew={props.allowNew}
          anchorElement={state.anchorElement}
          handleItemClick={handleItemClick}
          isOpen={true}
          query={state.query}
          source={props.source}
        />
      }
    </>
  )
}
