import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { ecuPropName } from '../configuration'
import { FileNodeType, FunctionNodeType, ImportDeclarationsRegistry } from '../types'

import graph from '../graph'
import { getNodeByAddress, getNodesByRole, getNodesBySecondNeighbourg } from '../graph/helpers'

import areArraysEqual from '../utils/areArraysEqual'
import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../utils/possiblyAddExtension'

import extractIdsAndIndexes from './extractIdsAndIndexes'

function getComponentHierarchy(sourceComponentId: string, hierarchyIds: string[]) {
  console.log('getComponentHierarchy')

  if (!hierarchyIds.length) {
    console.log('No hierarchy')

    return []
  }

  const componentNode = getNodeByAddress<FunctionNodeType>(graph, sourceComponentId)

  if (!componentNode) {
    console.log(`Component node with id ${sourceComponentId} not found`)

    return []
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, componentNode.address, 'declaresFunction')[0]

  if (!fileNode) {
    console.log(`Function for component node with id ${sourceComponentId} not found`)

    return []
  }

  const hierarchy: string[] = [] // retval
  const fileNodes = getNodesByRole<FileNodeType>(graph, 'File')
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(n => n.payload.isComponent)
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

  function traverseFileNode(fileNode: FileNodeType, previousX?: any) {
    hierarchy.push(fileNode.payload.name)

    const importDeclarationsRegistry: ImportDeclarationsRegistry = {}

    traverse(fileNode.payload.ast, {
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
              hierarchy.push(`${x.node.openingElement.name.name}[${currentIndexRegistry[hierarchyId]}]`)

              console.log('PUSHED')

              if (isNodeFound()) {
                console.log('SUCCESS')

                x.stop()

                if (previousX) {
                  previousX.stop()
                }
                // console.log('currentHierarchyIds', currentHierarchyIds)
                // console.log('currentIndexRegistry', currentIndexRegistry)
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

              // console.log('-->', absolutePath)

              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                // console.log('componentNode.payload.name', componentNode.payload.name)

                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('-->', fileNode.payload.name)

                  traverseFileNode(fileNode, x)
                }
              }
            }
          }
        }

        console.log('currentHierarchyIds', currentHierarchyIds)
        console.log('currentIndexRegistry', currentIndexRegistry)
      },
    })
  }

  traverseFileNode(fileNode)

  return hierarchy
}

export default getComponentHierarchy
