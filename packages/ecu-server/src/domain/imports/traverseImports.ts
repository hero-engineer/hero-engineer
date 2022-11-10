import traverse from '@babel/traverse'

import { FileNodeType, ImportType } from '../../types'

function traverseImports(fileNode: FileNodeType) {
  const imports: ImportType[] = []

  traverse(fileNode.payload.ast, {
    ImportDeclaration(path) {
      path.node.specifiers.forEach(s => {
        imports.push({
          source: path.node.source.value,
          name: s.local.name,
          type: s.type,
        })
      })
    },
  })

  return imports
}

export default traverseImports
