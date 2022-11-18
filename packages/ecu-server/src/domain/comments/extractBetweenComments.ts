import removePaddingEmptyLines from '../code/removePaddingEmptyLines.js'

function extractBetweenComments(code: string, startComment: string, endComment: string) {
  const startIndex = code.indexOf(startComment)
  const endIndex = code.indexOf(endComment)

  if (startIndex === -1 || endIndex === -1) return ''

  return removePaddingEmptyLines(code.slice(startIndex + startComment.length, endIndex)).trim()
}

export default extractBetweenComments
