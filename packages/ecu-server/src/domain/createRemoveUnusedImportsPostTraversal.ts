import {
  File,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from '@babel/types'
import traverse from '@babel/traverse'
import { ParseResult } from '@babel/parser'

function createRemoveUnusedImportsPostTraversal() {
  return (ast: ParseResult<File>) => {
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

export default createRemoveUnusedImportsPostTraversal
