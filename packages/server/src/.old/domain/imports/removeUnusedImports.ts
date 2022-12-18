import { ParseResult } from '@babel/core'

import traverse from '../traverse.js'

function removeUnunsedImports(ast: ParseResult | null) {
  const identifierNames: string[] = []

  traverse(ast, {
    Identifier(path) {
      identifierNames.push(path.node.name)
    },
  })

  traverse(ast, {
    ImportSpecifier(path) {
      if (identifierNames.includes(path.node.local.name)) return

      path.remove()

      if ((path.parentPath.node as any).specifiers.length) return

      path.parentPath.remove()
    },
    ImportDefaultSpecifier(path) {
      if (identifierNames.includes(path.node.local.name)) return

      path.remove()

      if ((path.parentPath.node as any).specifiers.length) return

      path.parentPath.remove()
    },
    ImportNamespaceSpecifier(path) {
      if (identifierNames.includes(path.node.local.name)) return

      path.remove()

      if ((path.parentPath.node as any).specifiers.length) return

      path.parentPath.remove()
    },
  })
}

export default removeUnunsedImports
