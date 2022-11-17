import fs from 'node:fs'
import path from 'node:path'

import { EcuHistoryEntryType } from '../types.js'
import { appPath, ecuHistoryFileName, ecuRelativePath } from '../configuration.js'

function writeEcuHistory(content: EcuHistoryEntryType[]) {
  const ecuPath = path.join(appPath, ecuRelativePath)

  if (!fs.existsSync(ecuPath)) {
    fs.mkdirSync(ecuPath)
  }

  const ecuHistoryFilePath = path.join(ecuPath, ecuHistoryFileName)

  fs.writeFileSync(ecuHistoryFilePath, JSON.stringify(content, null, 2), 'utf8')
}

export default writeEcuHistory
