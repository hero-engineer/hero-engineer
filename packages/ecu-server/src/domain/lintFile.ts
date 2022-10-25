import { ESLint } from 'eslint'

import { FileNodeType } from '../types'

async function lintFile(fileNode: FileNodeType) {
  const results = await new ESLint({ fix: true }).lintFiles(fileNode.payload.path)

  ESLint.outputFixes(results)
}

export default lintFile
