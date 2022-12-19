import fs from 'node:fs'
import path from 'node:path'

import { HistoryEntryType } from '../types.js'
import { appPath, heroEngineerRelativePath, historyFileName } from '../configuration.js'

function writeHistory(content: HistoryEntryType[]) {
  const ecuPath = path.join(appPath, heroEngineerRelativePath)

  if (!fs.existsSync(ecuPath)) {
    fs.mkdirSync(ecuPath)
  }

  const ecuHistoryFilePath = path.join(ecuPath, historyFileName)

  fs.writeFileSync(ecuHistoryFilePath, JSON.stringify(content, null, 2), 'utf8')
}

export default writeHistory
