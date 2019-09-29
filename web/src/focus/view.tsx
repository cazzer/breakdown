import get from 'lodash/get'
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Route } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import { Divider } from '@material-ui/core'

import ItemList from '../items'
import { RedBox } from '../red-box'
import { Groups } from '../groups/view'
import DeleteItem from '../delete-item'
import ValueView from './value-view'
import { itemByIdQuery } from './queries'
import Users from '../permissions/view'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      margin: theme.spacing(1)
    },
    content: {
      padding: theme.spacing(4)
    },
    item: {
      margin: theme.spacing(1)
    },
    root: {
      flowGrow: 1
    },
    permissions: {
      padding: theme.spacing(1)
    }
  })
)

function FocusView(props) {
  const classes = useStyles({})
  const { item } = props
  const directPermissions = get(item, ['permissionsByItemId', 'nodes'], [])
    .map(permission => ({
      id: permission.id,
      itemId: permission.itemId,
      role: permission.role,
      userOrGroup: permission.usersAndGroupByUserOrGroupId
    }))
  const inheritedPermissions = get(item, ['itemByInheritsFrom', 'permissionsByItemId', 'nodes'], [])
    .map(permission => ({
      id: permission.id,
      itemId: permission.itemId,
      role: permission.role,
      userOrGroup: permission.usersAndGroupByUserOrGroupId
    }))

  return (
    <div className={classes.root}>
      <Paper className={classes.item}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Groups childId={item.id} />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.permissions}>
            <Users
              permissions={directPermissions}
              inherited={inheritedPermissions}
              public={item.public}
              rowReverse={true}
            />
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.content}
        >
          <Grid item xs={12} xl={4}>
            <Typography color="textPrimary" variant="h6">
              {item.label}
            </Typography>
          </Grid>
          <Grid item xs={12} xl={8}>
            <ValueView value={item.value} />
          </Grid>
          <Divider />
          {item.userIsWriter && (
            <Grid item xs={12}>
              <Link to={`/view/focus/${item.id}/edit`}>
                <IconButton aria-label="Focus">
                  <EditIcon />
                </IconButton>
              </Link>
              <DeleteItem id={item.id} />
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  )
}

const LoadedFocusView = RedBox(FocusView)

export function ConnectedFocusView({ match }) {
  const { data, error, loading } = useQuery(itemByIdQuery, {
    variables: {
      id: match.params.itemId
    },
  })

  const item = get(data, 'itemById')

  return (
    <LoadedFocusView
      error={error}
      item={item}
      loading={loading && !item}
    />
  )
}

export const FocusWrapperView = (props) => (
  <>
    <Route path="/view/focus/:itemId" component={ConnectedFocusView} />
    <ItemList parentId={get(props.match.params, 'itemId', null)} />
  </>
)
