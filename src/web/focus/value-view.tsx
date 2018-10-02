import React from 'react'
import Typography from '@material-ui/core/Typography'
import Markdown from 'react-markdown'

import { guessType } from './type-guesser'
import { withStyles } from '@material-ui/core';

const StyledMarkdown = withStyles(theme => ({
  root: {
    color: theme.palette.primary.contrastText
  }
}))(({ classes, source }) => (
  <div className={classes.root}>
    <Markdown source={source} />
  </div>
))

export default ({ value }) => {
  const type = guessType(value)
  switch (type) {
    case 'markdown':
      return <StyledMarkdown source={value} />
    default:
      return <Typography>{value}</Typography>
  }
}
