import fs from 'node:fs'
import path from 'node:path'

import { ecuColorsFileName } from '../../configuration.js'
import { ColorType } from '../../types.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'

function readColors() {
  const ecuLocation = getEcuLocation()

  const fontsFileLocation = path.join(ecuLocation, ecuColorsFileName)

  if (!fs.existsSync(fontsFileLocation)) {
    return []
  }

  try {
    const fontsFileContent = fs.readFileSync(fontsFileLocation, 'utf8')

    return (JSON.parse(fontsFileContent) as ColorType[])
  }
  catch (error) {
    return []
  }
}

export default readColors
