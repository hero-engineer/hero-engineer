import fs from 'node:fs'
import path from 'node:path'

import { ecuColorsFileName } from '../../configuration.js'
import { ColorType } from '../../types.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'

function readColors() {
  const ecuLocation = getEcuLocation()

  const colorsFileLocation = path.join(ecuLocation, ecuColorsFileName)

  if (!fs.existsSync(colorsFileLocation)) {
    return []
  }

  try {
    const colorsFileContent = fs.readFileSync(colorsFileLocation, 'utf8')

    return (JSON.parse(colorsFileContent) as ColorType[])
  }
  catch (error) {
    console.error(error)

    return []
  }
}

export default readColors
