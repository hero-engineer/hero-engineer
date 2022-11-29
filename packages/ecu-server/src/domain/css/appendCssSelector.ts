import fs from 'node:fs'

import { BreakpointType, FileNodeType } from '../../types.js'

import traverseCss from './traverseCss.js'

async function appendCssSelector(fileNode: FileNodeType, selector: string, breakpoint: BreakpointType) {
  let isAlradyInserted = false

  await traverseCss(fileNode, selector, breakpoint, () => {
    isAlradyInserted = true
  })

  if (isAlradyInserted) return

  const code = breakpoint.media
    ? `${fileNode.payload.code}\n@media ${breakpoint.media} {\n  ${selector} {\n  }\n}\n`
    : `${fileNode.payload.code}\n${selector} {\n}\n`

  fs.writeFileSync(fileNode.payload.path, code, 'utf8')
}

export default appendCssSelector
