import { FileNodeType, TypeType } from '../../types'

import traverse from '../traverse'
import generate from '../generate'

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
