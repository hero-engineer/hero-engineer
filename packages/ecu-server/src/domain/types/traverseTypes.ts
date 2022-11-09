import traverse from '@babel/traverse'
import generate from '@babel/generator'

import { FileNodeType, TypeType } from '../../types'

function traverseTypes(fileNode: FileNodeType) {
  const types: TypeType[] = []

  traverse(fileNode.payload.ast, {
    TSTypeAliasDeclaration(path) {
      types.push({
        name: path.node.id.name,
        declaration: generate(path.node.typeAnnotation).code,
        fileNodeAddress: fileNode.address,
      })
    },
  })

  return types
}

export default traverseTypes
