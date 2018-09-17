import React from 'react'
import Typography from '@material-ui/core/Typography'
import Markdown from 'react-markdown'

import { guessType } from './type-guesser'

export default ({ value }) => {
  const type = guessType(value)
  switch (type) {
    case 'markdown':
      return <Markdown source={value} />
    default:
      return <Typography>{value}</Typography>
  }
}
