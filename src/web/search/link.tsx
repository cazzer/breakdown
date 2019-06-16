import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import SearchIcon from '@material-ui/icons/Search'

const styles = theme => ({
  root: {
    marginLeft: theme.spacing(1)
  }
})

const SearchLink = (props) => (
  <Link to="/search" className={props.classes.root}>
    <Fab color="primary" aria-label="Add">
      <SearchIcon />
    </Fab>
  </Link>
)

export default withStyles(styles)(SearchLink)
