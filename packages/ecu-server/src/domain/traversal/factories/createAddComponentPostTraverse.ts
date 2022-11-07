import path from 'node:path'

import {
  File,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  stringLiteral,
} from '@babel/types'
import traverse from '@babel/traverse'
import { ParseResult } from '@babel/parser'

import { FileNodeType, FunctionNodeType, ImportDeclarationsRegistry, PostTraverseType } from '../../../types'

function createAddComponentPostTraverse(componentNode: FunctionNodeType): PostTraverseType {
  return (fileNode: FileNodeType, ast: ParseResult<File>, importDeclarationsRegistry: ImportDeclarationsRegistry) => {
    if (componentNode.payload.path !== fileNode.payload.path) {
      const importDeclarations = importDeclarationsRegistry[fileNode.address]

      if (!importDeclarations.length) return

      const relativePathBetweenModules = path.relative(path.dirname(fileNode.payload.path), path.dirname(componentNode.payload.path))
      let relativePath = path.join(relativePathBetweenModules, componentNode.payload.name)

      if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`
      }

      if (!importDeclarations.some(x => x.value === relativePathBetweenModules && x.specifiers.some(s => s === componentNode.payload.name))) {
        traverse(ast, {
          ImportDeclaration(path: any) {
            path.insertBefore(importDeclaration([importDefaultSpecifier(identifier(componentNode.payload.name))], stringLiteral(relativePath)))

            path.stop()
          },
        })
      }
    }
  }
}

export default createAddComponentPostTraverse
