import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'

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
    backButton: {
      margin: theme.spacing(1)
    }
  })
)

export default function Users(
  props: {
    permissions: UserData[]
  } = {
    permissions: []
  }
) {
  const classes = useStyles()

  return (
    <>
      {props.permissions.map(permission => (
        <Tooltip key={permission.id} title={permission.userOrGroup.name}>
          <Avatar>
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
