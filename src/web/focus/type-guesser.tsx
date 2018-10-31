const markdownRegExp = /(^|\n)(#|-|\*)/g
const imageRegExp = /\.(gif|jpg|jpeg|png)$/
const linkRegExp = /^https?:\/\//

export function guessType(value: String = '') {
  if (value.match(imageRegExp)) {
    return 'image'
  }

  if (value.match(linkRegExp)) {
    return 'link'
  }

  if (value.match(markdownRegExp)) {
    return 'markdown'
  }

  if (~(value || '').indexOf('youtube')) {
    return 'video'
  }

  return 'text'
}
