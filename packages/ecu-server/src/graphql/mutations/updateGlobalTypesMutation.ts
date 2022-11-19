import fs from 'node:fs'
import path from 'node:path'

import { FileNodeType, HistoryMutationReturnType } from '../../types.js'
import { appPath, globalTypesFileBegginingComment, globalTypesFileRelativePath } from '../../configuration.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'
import { getNodesByRole } from '../../graph/index.js'

type UpdateGlobalTypesMutationArgs = {
  globalTypesFileContent: string
}

async function updateGlobalTypesMutation(_: any, { globalTypesFileContent }: UpdateGlobalTypesMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__updateGlobalTypesMutation__')

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
    description: 'Update global styles',
  }
}

export default composeHistoryMutation(updateGlobalTypesMutation)