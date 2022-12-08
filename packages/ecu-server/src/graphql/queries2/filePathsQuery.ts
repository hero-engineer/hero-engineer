import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'

function filePathsQuery() {
  const filePaths: string[] = []
  const srcLocation = path.join(appPath, 'src')

  function readDirectory(location: string) {
    fs.readdirSync(location).forEach(fileName => {
      const fileLocation = path.join(location, fileName)

      if (fs.statSync(fileLocation).isDirectory()) {
        return readDirectory(fileLocation)
      }

      filePaths.push(fileLocation)
    })
  }

  readDirectory(srcLocation)

  return filePaths
}

export default filePathsQuery
