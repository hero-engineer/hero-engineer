import { FileNodeType } from '../../types.js'

import removePaddingEmptyLines from '../code/removePaddingEmptyLines.js'

function extractBetweenComments(fileNode: FileNodeType, startComment: string, endComment: string) {
  const { code } = fileNode.payload

  const startIndex = code.indexOf(startComment)
  const endIndex = code.indexOf(endComment)

  if (startIndex === -1 || endIndex === -1) return ''

  return removePaddingEmptyLines(code.slice(startIndex + startComment.length, endIndex))
}

export default extractBetweenComments
