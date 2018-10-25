import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ReactLoading from 'react-loading'

export default () => (
  <Typography align="center">
    Loading...
  </Typography>
)

export const CubeLoader = withStyles(theme => ({
  loader: {
    margin: '0 auto',
    padding: '5vh'
  }
}))(({ classes }) => (
  <ReactLoading className={classes.loader} type={'cubes'} />
))
