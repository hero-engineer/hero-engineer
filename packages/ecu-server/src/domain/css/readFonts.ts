import fs from 'node:fs'
import path from 'node:path'

import { ecuFontsFileName } from '../../configuration.js'
import { FontType } from '../../types.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'

function readBreakpoints() {
  const ecuLocation = getEcuLocation()

  const fontsFileLocation = path.join(ecuLocation, ecuFontsFileName)

  if (!fs.existsSync(fontsFileLocation)) {
    return []
  }

  try {
    const fontsFileContent = fs.readFileSync(fontsFileLocation, 'utf8')

    return (JSON.parse(fontsFileContent) as FontType[])
  }
  catch (error) {
    return []
  }
}

export default readBreakpoints
