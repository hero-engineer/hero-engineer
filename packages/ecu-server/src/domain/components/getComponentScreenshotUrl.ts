import fs from 'node:fs'
import path from 'node:path'

import { FunctionNodeType } from '../../types.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'

function getComponentScreenshotUrl(componentNode: FunctionNodeType) {
  const ecuLocation = getEcuLocation()
  const screenshotPath = path.join(ecuLocation, 'screenshots', `${componentNode.address}.png`)

  return fs.existsSync(screenshotPath) ? `http://localhost:4001/.ecu/screenshots/${componentNode.address}.png` : 'http://localhost:4001/.ecu/component.svg'
}

export default getComponentScreenshotUrl
