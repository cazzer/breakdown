import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import ButtonBase from '@material-ui/core/ButtonBase'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import PublicIcon from '@material-ui/icons/Public'
import cx from 'classnames'

import { EditPermission, NewPermission } from '../permissions/edit'

interface UserData {
  id: string
  role: string
  timeCreated: Date
  userOrGroup: {
    id: string
    name: string
  }
}

enum UserPermissions {
  READER = 'READER',
  WRITER = 'WRITER'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarBorderRadius: {
      borderRadius: '50%'
    },
    tinyText: {
      fontSize: '.6em'
    },
    container: {
      display: 'flex',
      marginRight: theme.spacing(1)
    },
    rowReverse: {
      flexDirection: 'row-reverse'
    }
  })
)

function renderUserPermission(role) {
  switch (role) {
    case UserPermissions.WRITER:
      return 'R+W'
    default:
      return 'R'
  }
}

const SpanClass = (props) => (
  <span className={props.className}>{props.children}</span>
)

export default function Users(
  props: {
    permissions: UserData[],
    inherited?: UserData[],
    itemId: string,
    public?: boolean,
    rowReverse?: boolean
  } = {
    permissions: [],
    inherited: [],
    itemId: '',
    rowReverse: false
  }
) {
  const classes = useStyles({})
  const [permissionModal, setPermissionModal] = useState(null)

  const directPermissionUserIds = props.permissions.map(permission => (
    permission.userOrGroup.id
  ))
  const inheritedPermissions = props.inherited.filter(permission => (
    directPermissionUserIds.indexOf(permission.userOrGroup.id) === -1
  ))

  const editPermission = (permission) => () => {
    setPermissionModal(permission)
  }

  const closeEditPermission = () => {
    setPermissionModal(null)
  }

  return (
    <div className={cx(classes.container, {
      [classes.rowReverse]: props.rowReverse
    })}>
      <AvatarGroup>
        {props.public && (
          <Tooltip arrow title="public">
            <Avatar>
              <PublicIcon />
            </Avatar>
          </Tooltip>
        )}
        {props.permissions.map(permission => (
          <ButtonBase
            className={classes.avatarBorderRadius}
            disableRipple={true}
            key={permission.id}
            onClick={editPermission(permission)}
          >
            <Tooltip
              arrow
              title={permission.userOrGroup.name}
            >
              <Badge
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                badgeContent={
                  <SpanClass className={classes.tinyText}>
                    {renderUserPermission(permission.role)}
                  </SpanClass>
                }
                color="primary"
                overlap="circle"
              >
                <Avatar>
                  {
                    permission.userOrGroup.name
                      .substring(0, 1)
                      .toUpperCase()
                  }
                </Avatar>
              </Badge>
            </Tooltip>
          </ButtonBase>
        ))}
        {inheritedPermissions.map(permission => (
          <Tooltip key={permission.id} title={`${permission.userOrGroup.name} (inherited)`}>
            <Avatar>
              {
                permission.userOrGroup.name
                  .substring(0, 1)
                  .toUpperCase()
              }
            </Avatar>
          </Tooltip>
        ))}
        {permissionModal &&
          <Dialog
            open={!!permissionModal}
            onClose={closeEditPermission}
          >
            {permissionModal.id ? (
              <EditPermission permission={permissionModal} />
            ) : (
              <NewPermission itemId={props.itemId} />
            )}
          </Dialog>
        }
        <ButtonBase
          disableRipple={true}
          onClick={editPermission(true)}
          className={classes.avatarBorderRadius}
        >
          <Avatar>+</Avatar>
        </ButtonBase>
      </AvatarGroup>
    </div>
  )
}
