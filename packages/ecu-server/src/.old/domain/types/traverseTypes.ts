import { FileNodeType, TypeType } from '../../types.js'

import traverse from '../traverse.js'
import generate from '../generate.js'

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
