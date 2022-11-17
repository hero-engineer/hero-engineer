import fs from 'node:fs'
import path from 'node:path'

import { appPath, ecuHistoryFileName, ecuRelativePath } from '../configuration.js'
import { EcuHistoryEntryType } from '../types.js'

function readEcuHistory(): EcuHistoryEntryType[] {
  const ecuPath = path.join(appPath, ecuRelativePath)

  if (!fs.existsSync(ecuPath)) {
    fs.mkdirSync(ecuPath)
  }

  const ecuHistoryFilePath = path.join(ecuPath, ecuHistoryFileName)

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

export default readEcuHistory
