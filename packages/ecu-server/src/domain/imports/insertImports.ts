import { ParseResult } from '@babel/core'
import traverse from '@babel/traverse'

import { ImportType } from '../../types'

function insertImports(ast: ParseResult, imports: ImportType[]) {
  // const alreadyExistingImports
  traverse(ast, {
    ImportDeclaration(path) {
      const { source, specifiers } = path.node

    },
  })
}

export default insertImports
