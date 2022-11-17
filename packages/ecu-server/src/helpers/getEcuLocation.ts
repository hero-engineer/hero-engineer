import fs from 'node:fs'
import path from 'node:path'

import { appPath, ecuRelativePath } from '../configuration.js'

function getEcuLocation() {
  const ecuLocation = path.join(appPath, ecuRelativePath)

  if (!fs.existsSync(ecuLocation)) {
    fs.mkdirSync(ecuLocation)
  }

  return ecuLocation
}

export default getEcuLocation
