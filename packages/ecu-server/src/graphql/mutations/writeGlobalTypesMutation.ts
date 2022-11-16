import fs from 'node:fs'
import path from 'node:path'

import { FileNodeType, HistoryMutationReturnType } from '../../types.js'
import { appPath, globalTypesFileBegginingComment, globalTypesFileRelativePath } from '../../configuration.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'
import { getNodesByRole } from '../../graph/index.js'

type WriteGlobalTypesMutationArgs = {
  globalTypesFileContent: string
}

async function writeGlobalTypesMutation(_: any, { globalTypesFileContent }: WriteGlobalTypesMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  const globalTypesFilePath = path.join(appPath, globalTypesFileRelativePath)

  const fileNode = getNodesByRole<FileNodeType>('File').find(n => n.payload.path === globalTypesFilePath)

  if (!fileNode) {
    throw new Error('Global types file not found')
  }

  const finalGlobalTypesFileContent = `${globalTypesFileBegginingComment}

${globalTypesFileContent}
`

  fs.writeFileSync(globalTypesFilePath, finalGlobalTypesFileContent, 'utf8')

  return {
    returnValue: true,
    description: 'Write global styles',
  }
}

export default composeHistoryMutation(writeGlobalTypesMutation)
