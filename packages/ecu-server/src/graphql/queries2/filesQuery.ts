import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'

type FileType = {
  path: string
  relativePath: string
  content: string
}

function filesQuery() {
  const files: FileType[] = []
  const srcLocation = path.join(appPath, 'src')

  function readDirectory(location: string) {
    fs.readdirSync(location).forEach(fileName => {
      const fileLocation = path.join(location, fileName)

      if (fs.statSync(fileLocation).isDirectory()) {
        return readDirectory(fileLocation)
      }

      files.push({
        path: fileLocation,
        relativePath: path.relative(srcLocation, fileLocation),
        content: fs.readFileSync(fileLocation, 'utf8'),
      })
    })
  }

  readDirectory(srcLocation)

  return files
}

filesQuery()

export default filesQuery
