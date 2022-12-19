import fs from 'node:fs'
import path from 'node:path'

import { appPath, heroEngineerRelativePath } from '../configuration.js'

function getHeroEngineerLocation() {
  const location = path.join(appPath, heroEngineerRelativePath)

  if (!fs.existsSync(location)) {
    fs.mkdirSync(location)
  }

  return location
}

export default getHeroEngineerLocation
