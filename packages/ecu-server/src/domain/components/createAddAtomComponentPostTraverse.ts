import { ParseResult } from '@babel/core'

import { AtomType, FileNodeType, ImportType, PostTraverseType } from '../../types.js'
import { ecuPackageName } from '../../configuration.js'

import insertImports from '../imports/insertImports.js'

function createAddUserComponentPostTraverse(atom: AtomType): PostTraverseType {
  return (_fileNode: FileNodeType, ast: ParseResult) => {
    const importToAdd: ImportType = {
      source: ecuPackageName,
      name: atom.name,
      type: 'ImportSpecifier',
    }

    insertImports(ast, [importToAdd])
  }
}

export default createAddUserComponentPostTraverse
