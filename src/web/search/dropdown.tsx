import gql from 'graphql-tag'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useQuery } from 'react-apollo'
import React from 'react'
import { CubeLoader } from '../loading';

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

const ItemList = ({
  items,
  handleItemClick
}) => (
  <div>
    {items.map(item => (
      <ListItem button key={item.id} onClick={handleItemClick(item)}>
        <ListItemText
          primary={item.label}
        />
      </ListItem>
    ))}
  </div>
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

const ConnectedItemList = (
  props: { query: String }
) => {
  const { data, loading } = useQuery(searchItems, {
    variables: {
      input: props.query
    },
    fetchPolicy: 'cache-and-network'
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

class Search extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      anchorElement: null,
      isOpen: false,
      query: '',
      selectedItem: this.props.selectedItem
    }
  }

  handleItemClick = item => () => {
    this.setState({
      query: ''
    })

    this.props.handleSelect(item)
  }

  handleSearch = event => {
    this.setState({
      anchorElement: event.target,
      query: event.target.value
    })
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <TextField
          autoComplete="off"
          autoFocus
          id="search"
          onChange={this.handleSearch}
          onFocus={this.handleSearch}
          type="text"
          value={this.state.query}
        />
        {
          this.state.anchorElement &&
          this.state.query &&
          <Dropdown
            anchorElement={this.state.anchorElement}
            handleItemClick={this.handleItemClick}
            isOpen={true}
            query={this.state.query}
          />
        }
      </>
    )
  }
}

export default withStyles(styles)(Search)
