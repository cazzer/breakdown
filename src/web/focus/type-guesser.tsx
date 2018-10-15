const markdownRegExp = /(^|\n)(#|-|\*)/g
const imageRegExp = /\.(gif|jpg|jpeg|png)$/

export function guessType(value: String) {
  if ((value || '').match(imageRegExp)) {
    return 'image'
  }

  if ((value || '').match(markdownRegExp)) {
    return 'markdown'
  }

  if (~(value || '').indexOf('youtube')) {
    return 'video'
  }

  return 'text'
}
