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
import Divider from '@material-ui/core/Divider'
import { Query } from 'react-apollo'
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
  return (
    <Query
      query={searchItems}
      variables={{
        input: props.query
      }}
    >
      {({ data, loading }) => {
        if (loading) {
          return <CubeLoader />
        }

        return data.search.nodes.map(item => (
          <ListItem button key={item.id}>
            <ListItemText
              primary={item.label}
            />
          </ListItem>
        ))
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
      <List>
        <ListItem
          button
          onClick={handleItemClick({ label: query })}
        >
          <ListItemText
            primary={query}
          />
        </ListItem>
        <Divider />
        {
          query.length > 2
            ? <ConnectedItemList query={query} />
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
