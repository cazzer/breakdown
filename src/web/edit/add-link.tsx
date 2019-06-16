import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import get from 'lodash/get'

const styles = theme => ({
  root: {
    marginLeft: theme.spacing(1)
  }
})

const SearchLink = (props) => (
  <Link
    to={{
      pathname: "/add",
      search: get(props.match.params, 'itemId')
        ? `?parentId=${props.match.params.itemId}`
        : null
    }}
    className={props.classes.root}
  >
    <Fab color="primary" aria-label="Add">
      <AddIcon />
    </Fab>
  </Link>
)

export default withStyles(styles)(SearchLink)
