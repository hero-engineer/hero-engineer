import traverse from '@babel/traverse'

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
      console.log('path.node', path.node)
    },
  })

  return { impacted, types }
}

export default traverseTypes
