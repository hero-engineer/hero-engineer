import {
  File,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from '@babel/types'
import { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'

import { FileNodeType, FunctionNodeType } from '../../types'

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesBySecondNeighbourg } from '../../graph'
import updateGraphHash from '../../graph/hash/updateGraphHash'

import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import regenerate from '../../domain/regenerate'

type DeleteComponentArgs = {
  sourceComponentId: string
  hierarchyIds: string[]
}

async function deleteComponent(_: any, { sourceComponentId, hierarchyIds }: DeleteComponentArgs): Promise<FunctionNodeType | null> {
  console.log('___deleteComponent___')

  const componentNode = getNodeByAddress(sourceComponentId)

  if (!componentNode) {
    throw new Error(`File for Function with id ${sourceComponentId} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${sourceComponentId} not found`)
  }

  function mutate(x: any, previousX: any) {
    (previousX || x).remove()
  }

  function postTraverse(ast: ParseResult<File>) {
    const identifierNames: string[] = []

    traverse(ast, {
      JSXIdentifier(path: any) {
        identifierNames.push(path.node.name)
      },
    })

    traverse(ast, {
      ImportDeclaration(path: any) {
        if (path.node.specifiers.some((s: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => identifierNames.includes(s.local.name))) return

        path.remove()
      },
    })
  }

  const impacted = updateComponentHierarchy(fileNode, hierarchyIds, mutate)
  let impactedComponentNode: FunctionNodeType | null = null

  await Promise.all(impacted.map(async ({ fileNode, ast }) => {
    console.log('impacted:', fileNode.payload.name)

    postTraverse(ast)
    const regenerated = await regenerate(fileNode, ast)

    if (regenerated) {
      impactedComponentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0] || null
    }
  }))

  await updateGraphHash()

  return impactedComponentNode
}

export default deleteComponent
