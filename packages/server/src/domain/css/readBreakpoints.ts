import fs from 'node:fs'
import path from 'node:path'

import { breakpointsFileName, defaultBreakpoint } from '../../configuration.js'
import { BreakpointType } from '../../types.js'

import getHeroEngineerLocation from '../../helpers/getHeroEngineerLocation.js'

function readBreakpoints() {
  const ecuLocation = getHeroEngineerLocation()

  const breakpointsFileLocation = path.join(ecuLocation, breakpointsFileName)

  if (!fs.existsSync(breakpointsFileLocation)) {
    return [defaultBreakpoint]
  }

  try {
    const breakpointsFileContent = fs.readFileSync(breakpointsFileLocation, 'utf8')

    return (JSON.parse(breakpointsFileContent) as BreakpointType[]).sort((a, b) => b.max - a.max)
  }
  catch (error) {
    console.error(error)

    return [defaultBreakpoint]
  }
}

export default readBreakpoints
