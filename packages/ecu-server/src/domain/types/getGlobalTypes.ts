import fs from 'node:fs'
import path from 'node:path'

import { appPath, globalTypesFileBegginingComment, globalTypesFileRelativePath } from '../../configuration.js'
import { FileNodeType } from '../../types.js'

import { getNodesByRole } from '../../graph/index.js'

import removePaddingEmptyLines from '../code/removePaddingEmptyLines.js'

import traverseTypes from './traverseTypes.js'

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
    globalTypes: traverseTypes(fileNode),
  }
}

export default getGlobalTypes
