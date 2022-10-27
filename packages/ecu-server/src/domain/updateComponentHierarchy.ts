import path from 'path'

import {
  File,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { ParseResult } from '@babel/parser'

import { FileNodeType, FunctionNodeType, ImportDeclarationsRegistry } from '../types'
import { ecuPropName } from '../configuration'

import graph from '../graph'
import { getNodesByRole } from '../graph/helpers'

import areArraysEqual from '../utils/areArraysEqual'
import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../utils/possiblyAddExtension'

import extractIdAndIndex from './extractIdAndIndex'

function extractIdsAndIndexes(hierarchyIds: string[]): [string[], number[]] {
  const ids: string[] = []
  const indexes: number[] = []

  for (const hierarchyId of hierarchyIds) {
    const [id, index] = extractIdAndIndex(hierarchyId)

    ids.push(id)
    indexes.push(index)
  }

  return [ids, indexes]
}

function updateComponentHierarchy(
  fileNode: FileNodeType,
  hierarchyIds: string[],
  mutate: (x: any, previousX: any) => void,
  postTraverse: (ast: ParseResult<File>, importDeclaraclarationsRegistry: ImportDeclarationsRegistry) => void = () => {}
) {
  console.log('updateComponentHierarchy', fileNode.payload.name, hierarchyIds)

  const { ast } = fileNode.payload
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(n => n.payload.isComponent)
  const fileNodes = getNodesByRole<FileNodeType>(graph, 'File')
  const importDeclarationsRegistry: ImportDeclarationsRegistry = {}
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const currentHierarchyIds: string[] = []
  const currentIndexRegistry: Record<string, number> = {}

  const isSuccessiveNodeFound = (nextHierarchyId: string) => {
    const nextHierarchyIds = [...currentHierarchyIds, nextHierarchyId]

    return areArraysEqualAtStart(nextHierarchyIds, ids) && areArraysEqualAtStart(nextHierarchyIds.map(h => currentIndexRegistry[h]), indexes)
  }
  const isNodeFound = () => areArraysEqual(currentHierarchyIds, ids) && areArraysEqual(currentHierarchyIds.map(hierarchyId => currentIndexRegistry[hierarchyId]), indexes)

  console.log('ids', ids)
  console.log('indexes', indexes)
  console.log('___start___')

  function performMutation(x: any, previousX: any = null) {
    mutate(x, previousX)

    if (previousX) {
      previousX.stop()
    }

    x.stop()
  }

  function createTraversal(fileNode: FileNodeType, previousX: any = null) {
    return {
      ImportDeclaration(x: any) {
        if (!importDeclarationsRegistry[fileNode.address]) {
          importDeclarationsRegistry[fileNode.address] = []
        }

        importDeclarationsRegistry[fileNode.address].push({
          value: x.node.source.value,
          specifiers: x.node.specifiers.map((x: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => x.local.name),
        })
      },
      JSXElement(x: any) {
        if (!x.node) return

        const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

        // hierarchyId found means we're at an ecu-client Component
        if (idIndex !== -1) {
          const hierarchyId = x.node.openingElement.attributes[idIndex].value.value

          if (hierarchyId) {
            console.log('-->', hierarchyId)

            currentIndexRegistry[hierarchyId] = currentIndexRegistry[hierarchyId] + 1 || 0

            if (isSuccessiveNodeFound(hierarchyId)) {
              currentHierarchyIds.push(hierarchyId)

              console.log('PUSHED')

              if (isNodeFound()) {
                console.log('SUCCESS')

                performMutation(x, previousX)

                // console.log('currentHierarchyIds', currentHierarchyIds)
                // console.log('currentIndexRegistry', currentIndexRegistry)

                return
              }
            }
          }
        }
        // No hierarchyId found means we're at an imported Component node
        else {
          const importDeclarations = importDeclarationsRegistry[fileNode.address]

          if (importDeclarations.length) {
            const componentName = x.node.openingElement.name.name
            const relativeImportDeclaration = importDeclarations.find(x => x.value.startsWith('.') && x.specifiers.includes(componentName))

            if (relativeImportDeclaration) {
              const absolutePath = possiblyAddExtension(path.join(path.dirname(fileNode.payload.path), relativeImportDeclaration.value))

              console.log('-->', absolutePath)

              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                console.log('componentNode.payload.name', componentNode.payload.name)

                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('fileNode.payload.name', fileNode.payload.name)

                  traverse(fileNode.payload.ast, createTraversal(fileNode, x))
                }
              }
            }
          }
        }

        console.log('currentHierarchyIds', currentHierarchyIds)
        console.log('currentIndexRegistry', currentIndexRegistry)
      },
    }
  }

  traverse(ast, createTraversal(fileNode))
  postTraverse(ast, importDeclarationsRegistry)

  return ast
}

export default updateComponentHierarchy
