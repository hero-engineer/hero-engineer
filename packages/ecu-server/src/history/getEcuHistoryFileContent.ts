import fs from 'node:fs'
import path from 'node:path'

import { appPath, ecuHistoryFileName, ecuRelativePath } from '../configuration.js'

function getEcuHistoryFileContent(): string[] {
  const ecuPath = path.join(appPath, ecuRelativePath)

  if (!fs.existsSync(ecuPath)) {
    fs.mkdirSync(ecuPath)
  }

  const ecuHistoryFilePath = path.join(appPath, ecuRelativePath, ecuHistoryFileName)

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

  }

  return []
}

export default getEcuHistoryFileContent
