import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import get from 'lodash/get'

const styles = theme => ({
  root: {
    marginLeft: theme.spacing.unit
  }
})

const SearchLink = (props) => (
  <Link
    to={{
      pathname: "/add",
      search: get(props.match.params, 'itemId')
        ? `?parentId=${props.match.params.itemId}&new=true`
        : null
    }}
    className={props.classes.root}
  >
    <Button variant="fab" color="primary" aria-label="Add">
      <AddIcon />
    </Button>
  </Link>
)

export default withStyles(styles)(SearchLink)
