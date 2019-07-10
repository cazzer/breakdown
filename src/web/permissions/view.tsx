import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'
import PublicIcon from '@material-ui/icons/Public'

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
    }
  })
)

export default function Users(
  props: {
    permissions: UserData[],
    public?: boolean
  } = {
    permissions: []
  }
) {
  const classes = useStyles()

  return (
    <>
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
    </>
  )
}
