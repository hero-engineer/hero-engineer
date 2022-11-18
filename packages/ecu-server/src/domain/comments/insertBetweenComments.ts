function insertBetweenComments(code: string, startComment: string, endComment: string, content: string) {
  const startIndex = code.indexOf(startComment)
  const endIndex = code.indexOf(endComment)

  if (startIndex === -1 || endIndex === -1) return ''

  const nextCode = `${code.slice(0, startIndex + startComment.length)}\n${content}\n${code.slice(endIndex)}`

  return nextCode
}

export default insertBetweenComments
