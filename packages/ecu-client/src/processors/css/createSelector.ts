import { BreakpointType } from '~types'

import postCss, { filePathToCode } from '~processors/css'
import traverseCss from '~processors/css/traverseCss'

function sortBreakpoints(a: BreakpointType, b: BreakpointType) {
  if (!a.media && b.media) return -1
  if (a.media && !b.media) return 1

  return b.base - a.base
}

function createSelector(selector: string, breakpoints: BreakpointType[]) {
  const indexCssPath = Object.keys(filePathToCode).find(path => path.endsWith('/src/index.css'))

  if (!indexCssPath) {
    console.log('No index.css file found')

    return null
  }

  let code = filePathToCode[indexCssPath]
  const { root } = postCss.process(code, { from: indexCssPath })

  let isAlradyInserted = null

  traverseCss(root, selector, breakpoints[0], () => {
    isAlradyInserted = true
  })

  if (isAlradyInserted) return null

  for (const breakpoint of [...breakpoints].sort(sortBreakpoints)) {
    code = breakpoint.media
      ? `${code}\n@media ${breakpoint.media} {\n  ${selector} {\n  }\n}\n`
      : `${code}\n${selector} {\n}\n`
  }

  return code
}

export default createSelector
