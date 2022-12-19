import fs from 'node:fs'
import path from 'node:path'

import { ecuScreenshotsRelativePath } from '../configuration.js'

import getHeroEngineerLocation from './getHeroEngineerLocation.js'

function getHeroEngineerScreenshotsLocation() {
  const ecuLocation = getHeroEngineerLocation()

  const ecuScreenshotsLocation = path.join(ecuLocation, ecuScreenshotsRelativePath)

  if (!fs.existsSync(ecuScreenshotsLocation)) {
    fs.mkdirSync(ecuScreenshotsLocation)
  }

  return ecuScreenshotsLocation
}

export default getHeroEngineerScreenshotsLocation
