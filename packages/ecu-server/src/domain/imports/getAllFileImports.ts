import traverse from '@babel/traverse'

import { FileNodeType, ImportType } from '../../types'

function getAllFileImports(fileNode: FileNodeType) {
  const { ast } = fileNode.payload

  const imports: ImportType[] = []

  traverse(ast, {
    ImportDeclaration(path) {
      path.node.specifiers.forEach(s => {
        imports.push({
          value: path.node.source.value,
          name: s.local.name,
        })
      })
    },
  })

  return imports
}

export default getAllFileImports
