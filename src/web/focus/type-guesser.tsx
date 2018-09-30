const markdownRegExp = /(^|\n)(#|-|\*)/g

export function guessType(value: String) {
  if ((value || '').match(markdownRegExp)) {
    return 'markdown'
  }
  return 'text'
}
