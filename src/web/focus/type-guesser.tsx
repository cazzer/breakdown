import React from 'react'

import Text from '../editors/text'
import Markdown from '../editors/markdown'

export function guessType(value) {
  if ((value || '').match(/^(#+\s)/)) {
    return 'markdown'
  }
  return 'text'
}

export default (props) => {
  if ((props.value || '').match(/^([#-\*]+\s)/)) {
    return <Markdown {...props} />
  }
  return <Text {...props} />
}
