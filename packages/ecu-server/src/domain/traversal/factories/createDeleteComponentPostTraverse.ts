import {
  File,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from '@babel/types'
import { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'

import { FileNodeType, PostTraverseType } from '../../../types'

function createDeleteComponentPostTraverse(): PostTraverseType {
  return (_fileNode: FileNodeType, ast: ParseResult<File>) => {
    const identifierNames: string[] = []

    traverse(ast, {
      JSXIdentifier(path: any) {
        identifierNames.push(path.node.name)
      },
    })

    traverse(ast, {
      ImportDeclaration(path: any) {
        if (path.node.specifiers.some((s: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => identifierNames.includes(s.local.name))) return

        path.remove()
      },
    })
  }
}

export default createDeleteComponentPostTraverse
