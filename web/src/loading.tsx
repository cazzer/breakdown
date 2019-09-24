import React from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ReactLoading from 'react-loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loader: {
      margin: '0 auto',
      padding: '5vh'
    }
  })
)

export default () => (
  <Typography align="center">
    Loading...
  </Typography>
)

export const CubeLoader = () => {
  const classes = useStyles({})
  return (
    <ReactLoading className={classes.loader} type={'cubes'} />
  )
}
