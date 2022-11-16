import fs from 'node:fs'
import path from 'node:path'

import { appPath, ecuHistoryFileName, ecuRelativePath } from '../configuration.js'

import getEcuHistoryFileContent from './getEcuHistoryFileContent.js'

function appendToEcuHistoryFile(branchName: string) {
  const branchArray = getEcuHistoryFileContent()

  const ecuHistoryFilePath = path.join(appPath, ecuRelativePath, ecuHistoryFileName)

  fs.writeFileSync(ecuHistoryFilePath, JSON.stringify([...branchArray, branchName], null, 2))
}

export default appendToEcuHistoryFile
