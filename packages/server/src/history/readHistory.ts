import fs from 'node:fs'
import path from 'node:path'

import { appPath, heroEngineerRelativePath, historyFileName } from '../configuration.js'
import { HistoryEntryType } from '../types.js'

function readHistory(): HistoryEntryType[] {
  const ecuPath = path.join(appPath, heroEngineerRelativePath)

  if (!fs.existsSync(ecuPath)) {
    fs.mkdirSync(ecuPath)
  }

  const ecuHistoryFilePath = path.join(ecuPath, historyFileName)

  if (!fs.existsSync(ecuHistoryFilePath)) {
    fs.writeFileSync(ecuHistoryFilePath, '[]')

    return []
  }

  const ecuHistoryFileContent = fs.readFileSync(ecuHistoryFilePath, 'utf8')

  try {
    return JSON.parse(ecuHistoryFileContent)
  }
  catch (error) {
    console.log(error)

    return []
  }
}

export default readHistory
