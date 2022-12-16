import fs from 'node:fs'
import path from 'node:path'

import getEcuScreenshotsLocation from '../helpers/getEcuScreenshotsLocation.js'

function deleteAllScreenshots() {
  const ecuScreeshotsLocation = getEcuScreenshotsLocation()

  fs.readdirSync(ecuScreeshotsLocation).forEach(fileName => {
    fs.unlinkSync(path.join(ecuScreeshotsLocation, fileName))
  })
}

export default deleteAllScreenshots
