import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing.unit,
    right: theme.spacing.unit
  }
})

const SearchLink = (props) => (
  <Link to="/search" className={props.classes.root}>
    <Button variant="fab" color="primary" aria-label="Add">
      <SearchIcon />
    </Button>
  </Link>
)

export default withStyles(styles)(SearchLink)
