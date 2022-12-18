import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'

function filePathsQuery() {
  const filePaths: string[] = []
  const srcPath = path.join(appPath, 'src')

  function readDirectory(location: string) {
    fs.readdirSync(location).forEach(fileName => {
      const filePath = path.join(location, fileName)

      if (fs.statSync(filePath).isDirectory()) {
        return readDirectory(filePath)
      }

      filePaths.push(filePath)
    })
  }

  readDirectory(srcPath)

  return filePaths
}

export default filePathsQuery
