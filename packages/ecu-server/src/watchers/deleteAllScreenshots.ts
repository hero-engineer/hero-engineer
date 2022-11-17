import fs from 'node:fs'
import path from 'node:path'

import getEcuScreenshotsLocation from '../helpers/getEcuScreenshotsLocation.js'

function deleteAllScreenshots() {
  const ecuScreeshotsLocation = getEcuScreenshotsLocation()

  fs.readdirSync(ecuScreeshotsLocation).forEach(file => {
    fs.unlinkSync(path.join(ecuScreeshotsLocation, file))
  })
}

export default deleteAllScreenshots
