import fs from 'node:fs'
import path from 'node:path'

import { FileType } from '../../types.js'
import { appPath } from '../../configuration.js'

function filesQuery() {
  const files: FileType[] = []
  const srcPath = path.join(appPath, 'src')

  function readDirectory(location: string) {
    fs.readdirSync(location).forEach(fileName => {
      const filePath = path.join(location, fileName)

      if (fs.statSync(filePath).isDirectory()) {
        return readDirectory(filePath)
      }

      files.push({
        path: filePath,
        code: fs.readFileSync(filePath, 'utf8'),
      })
    })
  }

  readDirectory(srcPath)

  return files
}

export default filesQuery
