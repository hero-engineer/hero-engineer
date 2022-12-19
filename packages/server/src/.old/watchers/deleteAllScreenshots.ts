import fs from 'node:fs'
import path from 'node:path'

import getHeroEngineerScreenshotsLocation from '../helpers/getHeroEngineerScreenshotsLocation.js'

function deleteAllScreenshots() {
  const ecuScreeshotsLocation = getHeroEngineerScreenshotsLocation()

  fs.readdirSync(ecuScreeshotsLocation).forEach(fileName => {
    fs.unlinkSync(path.join(ecuScreeshotsLocation, fileName))
  })
}

export default deleteAllScreenshots
