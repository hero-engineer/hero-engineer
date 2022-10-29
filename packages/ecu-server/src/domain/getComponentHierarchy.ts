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

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../graph'
import areArraysEqual from '../utils/areArraysEqual'
import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../utils/possiblyAddExtension'

import extractIdAndIndex from './extractIdAndIndex'
import extractIdsAndIndexes from './extractIdsAndIndexes'

type IndexRegistry = Record<string, number>
type HierarchyItem = {
  label: string
  hierarchyId?: string
  componentAddress?: string
}

function getComponentHierarchy(sourceComponentAddress: string, hierarchyIds: string[]) {
  console.log('getComponentHierarchy')

  if (!hierarchyIds.length) {
    console.log('No hierarchy')

    return []
  }

  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    console.log(`Component node with id ${sourceComponentAddress} not found`)

    return []
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`Function for component node with id ${sourceComponentAddress} not found`)

    return []
  }

  const hierarchy: HierarchyItem[] = [] // retval
  const fileNodes = getNodesByRole<FileNodeType>('File')
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: IndexRegistry = {}

  console.log('ids', ids)
  console.log('indexes', indexes)
  console.log('___start___')

  function isSuccessiveNodeFound(nextHierarchyId: string) {
    const nextHierarchyIds = [...lastingHierarchyIds, nextHierarchyId]

    return areArraysEqualAtStart(nextHierarchyIds, ids) && areArraysEqualAtStart(nextHierarchyIds.map(h => lastingIndexRegistry[h]), indexes)
  }

  function isNodeFound() {
    return areArraysEqual(lastingHierarchyIds, ids) && areArraysEqual(lastingHierarchyIds.map(hierarchyId => lastingIndexRegistry[hierarchyId]), indexes)
  }

  function traverseFileNode(fileNode: FileNodeType, index = 0, stop = () => {}, succeed = () => {}) {
    console.log('---->', fileNode.payload.name)

    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) {
      console.log(`No component node found in file ${fileNode.address}`)

      return
    }

    const label = `${componentNode.payload.name}[${index}]`
    const indexRegistry: IndexRegistry[] = [{}]
    const importDeclarationsRegistry: ImportDeclarationsRegistry = {}
    let shouldContinue = true
    let shouldPushIndex = true

    hierarchy.push({
      label,
      componentAddress: componentNode.address,
    })

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

            const [componentAddress] = extractIdAndIndex(hierarchyId)

            // console.log('componentAddress', componentAddress)

            indexRegistry[indexRegistry.length - 1][componentAddress] = indexRegistry[indexRegistry.length - 1][componentAddress] + 1 || 0
            lastingIndexRegistry[hierarchyId] = lastingIndexRegistry[hierarchyId] + 1 || 0
            shouldPushIndex = true

            // console.log('JSXElement indexRegistry', indexRegistry)

            if (isSuccessiveNodeFound(hierarchyId)) {
              lastingHierarchyIds.push(hierarchyId)
              hierarchy.push({
                label: `${x.node.openingElement.name.name}[${indexRegistry[indexRegistry.length - 1][componentAddress]}]`,
                hierarchyId: `${hierarchyId}:${lastingIndexRegistry[hierarchyId]}`,
              })

              console.log('PUSHED')

              if (isNodeFound()) {
                console.log('SUCCESS')

                shouldContinue = false
                x.stop()
                stop()
                succeed()
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
                // console.log('componentNode.payload.name', componentNode.payload.name)

                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('-->', fileNode.payload.name)

                  indexRegistry[indexRegistry.length - 1][fileNode.payload.name] = indexRegistry[indexRegistry.length - 1][fileNode.payload.name] + 1 || 0
                  // console.log('JSXElement indexRegistry', indexRegistry)

                  shouldPushIndex = false

                  traverseFileNode(
                    fileNode,
                    indexRegistry[indexRegistry.length - 1][fileNode.payload.name],
                    () => {
                      x.stop()
                      stop()
                    },
                    () => {
                      shouldContinue = false
                    }
                  )
                }
              }
            }
          }
        }

        if (!x.node.selfClosing && shouldPushIndex) {
          indexRegistry.push({})
        }

        // console.log('JSXElement post indexRegistry', indexRegistry)
      },
      JSXClosingElement() {
        // Prevent fragments from interering with indexing
        if (indexRegistry.length > 1) {
          indexRegistry.pop()
        }

        // console.log('JSXClosingElement indexRegistry', indexRegistry)
      },
    })

    // If no success, remove inserted element from hierarchy
    if (shouldContinue) {
      for (let i = hierarchy.length - 1; i >= 0; i--) {
        const popped = hierarchy.pop()

        // console.log('popped', popped)
        if (popped?.label === label) break
      }
    }

    console.log('<----', fileNode.payload.name)
    console.log('indexRegistry', indexRegistry)
    console.log('hierarchy', hierarchy)
  }

  traverseFileNode(fileNode)

  return hierarchy
}

export default getComponentHierarchy
