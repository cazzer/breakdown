import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'
import PublicIcon from '@material-ui/icons/Public'
import cx from 'classnames'

interface UserData {
  id: string
  role: string
  userOrGroup: {
    id: string
    name: string
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      marginRight: theme.spacing(1)
    },
    container: {
      display: 'flex',
    },
    rowReverse: {
      flexDirection: 'row-reverse'
    }
  })
)

export default function Users(
  props: {
    permissions: UserData[],
    inherited?: UserData[],
    public?: boolean,
    rowReverse?: boolean
  } = {
    permissions: [],
    inherited: [],
    rowReverse: false
  }
) {
  const classes = useStyles({})

  const directPermissionUserIds = props.permissions.map(permission => (
    permission.userOrGroup.id
  ))
  const inheritedPermissions = props.inherited.filter(permission => (
    directPermissionUserIds.indexOf(permission.userOrGroup.id) === -1
  ))

  return (
    <div className={cx(classes.container, {
      [classes.rowReverse]: props.rowReverse
    })}>
      {props.public && (
        <Tooltip title="public">
          <Avatar className={classes.avatar}>
            <PublicIcon />
          </Avatar>
        </Tooltip>
      )}
      {props.permissions.map(permission => (
        <Tooltip key={permission.id} title={permission.userOrGroup.name}>
          <Avatar className={classes.avatar}>
            {
              permission.userOrGroup.name
                .substring(0, 1)
                .toUpperCase()
            }
          </Avatar>
        </Tooltip>
      ))}
      {inheritedPermissions.map(permission => (
        <Tooltip key={permission.id} title={`${permission.userOrGroup.name} (inherited)`}>
          <Avatar className={classes.avatar}>
            {
              permission.userOrGroup.name
                .substring(0, 1)
                .toUpperCase()
            }
          </Avatar>
        </Tooltip>
      ))}
    </div>
  )
}
