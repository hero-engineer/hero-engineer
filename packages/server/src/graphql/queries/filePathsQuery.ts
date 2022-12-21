import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'

function filePathsQuery() {
  const filePaths: string[] = []

  function readDirectory(location: string) {
    fs.readdirSync(location).forEach(fileName => {
      const filePath = path.join(location, fileName)

      if (fs.statSync(filePath).isDirectory() && !filePath.includes('node_modules')) {
        readDirectory(filePath)

        return
      }

      filePaths.push(filePath)
    })
  }

  readDirectory(appPath)

  return filePaths
}

export default filePathsQuery
