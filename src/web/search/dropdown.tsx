import get from 'lodash/get'
import gql from 'graphql-tag'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Query } from 'react-apollo'
import React from 'react'
import { CubeLoader } from '../loading';

const styles = theme => ({
  container: {
    flexGrow: 1,
  },
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

const ConnectedItemList = (props) => {
  return (
    <Query
      query={searchItems}
      variables={{
        input: props.query
      }}
    >
      {(searchResults) => {
        if (searchResults.loading) {
          return <CubeLoader />
        }

        const results = searchResults.data.search.nodes
        if (!results.length) {
          return <Typography>Nothing to see here.</Typography>
        }

        return <ItemList items={results} {...props} />
      }}
    </Query>
  )
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
      <MenuItem onClick={handleItemClick(null)}>No Parent</MenuItem>
      {query.length > 2 ? (
        <ConnectedItemList
          handleItemClick={handleItemClick}
          query={query}
        />
      ) : (
        <Typography>Type more to see more...</Typography>
      )}
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
      isOpen: false,
      query: '',
      selectedItem: item
    })

    this.props.onUpdate(item ? item.id : null)
  }

  handleCloseSearch = () => {
    this.setState({
      isOpen: false
    })
  }

  handleOpenSearch = () => {
    this.setState({
      isOpen: true
    })
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
      <div className={classes.container}>
        {this.state.isOpen ? (
          <TextField
            autoComplete="off"
            autoFocus
            id="search"
            fullWidth
            onChange={this.handleSearch}
            onFocus={this.handleSearch}
            type="text"
            value={this.state.query}
          />
        ) : (
          <List>
            <ListItem button onClick={this.handleOpenSearch} >
              <ListItemText
                primary="Parent Item"
                secondary={get(this.state.selectedItem, 'label', 'None')}
              />
            </ListItem>
          </List>
        )}
        {
          this.state.isOpen &&
          this.state.anchorElement &&
          <Dropdown
            anchorElement={this.state.anchorElement}
            handleItemClick={this.handleItemClick}
            isOpen={true}
            query={this.state.query}
          />
        }
      </div>
    )
  }
}

export default withStyles(styles)(Search)
