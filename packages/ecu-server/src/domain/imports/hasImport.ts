import traverse from '@babel/traverse'

import { FileNodeType } from '../../types'

function hasImport(fileNode: FileNodeType, importValue: string, importName: string) {
  const { ast } = fileNode.payload

  let hasImport = false

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === importValue && path.node.specifiers.some(s => s.local.name === importName)) {
        hasImport = true
        path.stop()
      }
    },
  })

  return hasImport
}

export default hasImport
