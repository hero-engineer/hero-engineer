import fs from 'node:fs'
import path from 'node:path'

import { appPath, globalTypesFileBegginingComment, globalTypesFileRelativePath } from '../../configuration'
import { FileNodeType } from '../../types'

import { getNodesByRole } from '../../graph'

import traverseTypes from '../traversal/traverseTypes'

function removePaddingEmptyLines(text: string) {
  const textArray = text.split('\n')

  for (const line of [...textArray]) {
    if (line.trim() === '') textArray.shift()
    else break
  }

  for (const line of [...textArray].reverse()) {
    if (line.trim() === '') textArray.pop()
    else break
  }

  return textArray.join('\n')
}

function getGlobalTypes() {
  const globalTypesFilePath = path.join(appPath, globalTypesFileRelativePath)
  const globalTypesFileContent = fs.readFileSync(globalTypesFilePath, 'utf8')

  let finalGlobalTypesFileContent = removePaddingEmptyLines(globalTypesFileContent)

  if (globalTypesFileContent.startsWith(globalTypesFileBegginingComment)) {
    finalGlobalTypesFileContent = removePaddingEmptyLines(finalGlobalTypesFileContent.slice(globalTypesFileBegginingComment.length))
  }

  const fileNode = getNodesByRole<FileNodeType>('File').find(n => n.payload.path === globalTypesFilePath)

  if (!fileNode) {
    throw new Error('Global types file not found')
  }

  return {
    globalTypesFileContent: finalGlobalTypesFileContent,
    globalTypes: traverseTypes(fileNode).types,
  }
}

export default getGlobalTypes
