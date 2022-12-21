import fs from 'node:fs'
import path from 'node:path'

import { HistoryMutationReturnType } from '../../types.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type SaveFileMutationArgsType = {
  filePath: string
  code: string
  commitMessage: string
}

async function saveFileMutation(_: any, { filePath, code, commitMessage }: SaveFileMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, code, 'utf8')

  return {
    returnValue: true,
    description: commitMessage,
  }
}

export default composeHistoryMutation(saveFileMutation)
