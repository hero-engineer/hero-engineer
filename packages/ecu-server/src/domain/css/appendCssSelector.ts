import fs from 'node:fs'

import { FileNodeType } from '../../types.js'

import traverseCss from './traverseCss.js'

async function appendCssSelector(fileNode: FileNodeType, selector: string) {
  let isAlradyInserted = false

  await traverseCss(fileNode, selector, null, () => {
    isAlradyInserted = true
  })

  if (isAlradyInserted) return

  const code = `${fileNode.payload.code}\n${selector} {}\n`

  fs.writeFileSync(fileNode.payload.path, code, 'utf8')
}

export default appendCssSelector
