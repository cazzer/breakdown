import React from 'react'
import Markdown from 'react-markdown'

import Text from './text'

export default (props) => (
  <div>
    <Text {...props} />
    <Markdown source={props.value} />
  </div>
)
