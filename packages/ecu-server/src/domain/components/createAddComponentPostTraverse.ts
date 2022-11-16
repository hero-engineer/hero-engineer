import path from 'node:path'

import { ParseResult } from '@babel/core'

import { FileNodeType, FunctionNodeType, ImportType, PostTraverseType } from '../../types.js'

import insertImports from '../imports/insertImports.js'

function createAddComponentPostTraverse(componentNode: FunctionNodeType): PostTraverseType {
  // Add potential missing import of added component in the mutated file
  return (fileNode: FileNodeType, ast: ParseResult) => {
    if (componentNode.payload.path === fileNode.payload.path) return

    const relativePathBetweenModules = path.relative(path.dirname(fileNode.payload.path), path.dirname(componentNode.payload.path))
    let relativePath = path.join(relativePathBetweenModules, componentNode.payload.name)

    if (!relativePath.startsWith('.')) {
      relativePath = `./${relativePath}`
    }

    const importToAdd: ImportType = {
      source: relativePath,
      name: componentNode.payload.name,
      type: 'ImportDefaultSpecifier',
    }

    insertImports(ast, [importToAdd])
  }
}

export default createAddComponentPostTraverse
