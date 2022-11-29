import fs from 'node:fs'
import path from 'node:path'

import { defaultBreakpoint, ecuBreakpointsFileName } from '../../configuration.js'
import { BreakpointType } from '../../types.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'

function readBreakpoints() {
  const ecuLocation = getEcuLocation()

  const breakpointsFileLocation = path.join(ecuLocation, ecuBreakpointsFileName)

  if (!fs.existsSync(breakpointsFileLocation)) {
    return [defaultBreakpoint]
  }

  try {
    const breakpointsFileContent = fs.readFileSync(breakpointsFileLocation, 'utf8')

    return (JSON.parse(breakpointsFileContent) as BreakpointType[]).sort((a, b) => b.max - a.max)
  }
  catch (error) {
    return [defaultBreakpoint]
  }
}

export default readBreakpoints
