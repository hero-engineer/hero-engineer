import fs from 'node:fs'
import path from 'node:path'

import { FunctionNodeType } from '../../types.js'

import getHeroEngineerLocation from '../../helpers/getHeroEngineerLocation.js'

function getComponentScreenshotUrl(componentNode: FunctionNodeType) {
  const ecuLocation = getHeroEngineerLocation()
  const screenshotPath = path.join(ecuLocation, 'screenshots', `${componentNode.address}.png`)

  return fs.existsSync(screenshotPath) ? `http://localhost:4001/.hero-engineer/screenshots/${componentNode.address}.png` : 'http://localhost:4001/.hero-engineer/component.svg'
}

export default getComponentScreenshotUrl
