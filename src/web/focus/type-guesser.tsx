import React from 'react'

import Text from '../editors/text'
import Markdown from '../editors/markdown'

const markdownRegExp = /(^|\n)(#|-|\*)/g

export function guessType(value: String) {
  if ((value || '').match(markdownRegExp)) {
    return 'markdown'
  }
  return 'text'
}

export default (props: Object) => {
  if ((props.value || '').match(markdownRegExp)) {
    return <Markdown {...props} />
  }
  return <Text {...props} />
}
