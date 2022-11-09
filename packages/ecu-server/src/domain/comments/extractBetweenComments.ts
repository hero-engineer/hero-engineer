import { FileNodeType } from '../../types'

import removePaddingEmptyLines from '../code/removePaddingEmptyLines'

function extractBetweenComments(fileNode: FileNodeType, startComment: string, endComment: string) {
  const { code } = fileNode.payload

  const startIndex = code.indexOf(startComment)
  const endIndex = code.indexOf(endComment)

  if (startIndex === -1 || endIndex === -1) return ''

  return removePaddingEmptyLines(code.slice(startIndex + startComment.length, endIndex))
}

export default extractBetweenComments
