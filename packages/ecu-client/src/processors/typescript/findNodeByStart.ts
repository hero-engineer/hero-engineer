import { SourceFile } from 'ts-morph'

function findNodeByStart(sourceFile: SourceFile, start: number) {
  if (start === -1) return null

  return sourceFile.forEachDescendant(node => {
    if (node.getFullStart() === start) return node
  }) ?? null
}

export default findNodeByStart
