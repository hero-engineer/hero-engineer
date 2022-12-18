import { BreakpointType } from '~types'

import postCss, { cssReady, getIndexCss, setIndexCss } from '~processors/css'
import traverse from '~processors/css/traverse'

function sortBreakpoints(a: BreakpointType, b: BreakpointType) {
  if (!a.media && b.media) return -1
  if (a.media && !b.media) return 1

  return b.base - a.base
}

async function createSelector(selector: string, breakpoints: BreakpointType[]) {
  await cssReady.promise

  const { filePath, code } = getIndexCss()

  const { root } = postCss.process(code, { from: filePath })

  let isAlreadyInserted = false

  traverse(root, rule => {
    if (rule.selector === selector) isAlreadyInserted = true
  })

  if (isAlreadyInserted) {
    throw new Error(`Selector ${selector} already exists in index.css`)
  }

  let nextCode = code

  for (const breakpoint of [...breakpoints].sort(sortBreakpoints)) {
    nextCode = breakpoint.media
      ? `${nextCode}\n@media ${breakpoint.media} {\n  ${selector} {\n  }\n}\n`
      : `${nextCode}\n${selector} {\n}\n`
  }

  setIndexCss(nextCode)

  return { code: nextCode, filePath }
}

export default createSelector
