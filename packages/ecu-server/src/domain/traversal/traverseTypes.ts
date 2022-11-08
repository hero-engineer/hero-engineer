import traverse from '@babel/traverse'
import generate from '@babel/generator'

import { FileNodeType, ImpactedType, TypeType } from '../../types'

type TraverseTypesReturnType = {
  impacted: ImpactedType[],
  types: TypeType[],
}

function traverseTypes(fileNode: FileNodeType): TraverseTypesReturnType {
  const { ast } = fileNode.payload

  const impacted: ImpactedType[] = [{ ast, fileNode, importDeclarationsRegistry: {} }]
  const types: TypeType[] = []

  traverse(ast, {
    TSTypeAliasDeclaration(path) {
      types.push({
        name: path.node.id.name,
        declaration: generate(path.node.typeAnnotation).code,
        fileNodeAddress: fileNode.address,
      })
    },
  })

  return { impacted, types }
}

export default traverseTypes
