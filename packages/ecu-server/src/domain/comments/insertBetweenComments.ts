import fs from 'node:fs'

import { FileNodeType } from '../../types'

function insertBetweenComments(fileNode: FileNodeType, startComment: string, endComment: string, content: string) {
  const { code } = fileNode.payload

  const startIndex = code.indexOf(startComment)
  const endIndex = code.indexOf(endComment)

  if (startIndex === -1 || endIndex === -1) return ''

  const nextCode = `${code.slice(0, startIndex + startComment.length)}\n${content}\n${code.slice(endIndex)}`

  fs.writeFileSync(fileNode.payload.path, nextCode, 'utf8')

  return nextCode
}

export default insertBetweenComments
