import fs from 'node:fs'
import path from 'node:path'

import { ecuScreenshotsRelativePath } from '../configuration.js'

import getEcuLocation from './getEcuLocation.js'

function getEcuScreenshotsLocation() {
  const ecuLocation = getEcuLocation()

  const ecuScreenshotsLocation = path.join(ecuLocation, ecuScreenshotsRelativePath)

  if (!fs.existsSync(ecuScreenshotsLocation)) {
    fs.mkdirSync(ecuScreenshotsLocation)
  }

  return ecuScreenshotsLocation
}

export default getEcuScreenshotsLocation
