import { ParseResult } from '@babel/core'
import traverse from '@babel/traverse'

import { FileNodeType, PostTraverseType } from '../../../types'

function createDeleteComponentPostTraverse(): PostTraverseType {
  return (_fileNode: FileNodeType, ast: ParseResult) => {
    const identifierNames: string[] = []

    traverse(ast, {
      JSXIdentifier(path) {
        identifierNames.push(path.node.name)
      },
    })

    traverse(ast, {
      ImportDeclaration(path) {
        if (path.node.specifiers.some(s => identifierNames.includes(s.local.name))) return

        path.remove()
      },
    })
  }
}

export default createDeleteComponentPostTraverse
