import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { ecuPropName } from '../../configuration'
import { FileNodeType, FunctionNodeType, HierarchyItemType, ImportDeclarationsRegistry, IndexRegistryType } from '../../types'

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'
import areArraysEqual from '../../utils/areArraysEqual'
import areArraysEqualAtStart from '../../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

import extractIdAndIndex from '../utils/extractIdAndIndex'
import extractIdsAndIndexes from '../utils/extractIdsAndIndexes'

function getComponentHierarchy(sourceComponentAddress: string, hierarchyIds: string[]): HierarchyItemType[] {
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

  const hierarchy: HierarchyItemType[] = [] // retval
  const fileNodes = getNodesByRole<FileNodeType>('File')
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: IndexRegistryType = {}

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

  function traverseFileNode(fileNode: FileNodeType, index = 0, stop = () => {}) {
    console.log('---->', fileNode.payload.name)

    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) {
      console.log(`No component node found in file ${fileNode.address}`)

      return
    }

    const label = `${componentNode.payload.name}[${index}]`
    const indexRegistries: IndexRegistryType[] = [{}]
    const importDeclarationsRegistry: ImportDeclarationsRegistry = {}
    let shouldContinue = true
    let shouldPushIndex = true

    hierarchy.push({
      label,
      componentAddress: componentNode.address,
      componentName: componentNode.payload.name,
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

            indexRegistries[indexRegistries.length - 1][componentAddress] = indexRegistries[indexRegistries.length - 1][componentAddress] + 1 || 0
            lastingIndexRegistry[hierarchyId] = lastingIndexRegistry[hierarchyId] + 1 || 0
            shouldPushIndex = true

            // console.log('JSXElement indexRegistries', indexRegistries)

            if (isSuccessiveNodeFound(hierarchyId)) {
              lastingHierarchyIds.push(hierarchyId)
              hierarchy.push({
                label: `${x.node.openingElement.name.name}[${indexRegistries[indexRegistries.length - 1][componentAddress]}]`,
                componentName: x.node.openingElement.name.name,
                hierarchyId: `${hierarchyId}:${lastingIndexRegistry[hierarchyId]}`,
              })

              console.log('PUSHED')

              if (isNodeFound()) {
                console.log('SUCCESS')

                shouldContinue = false

                x.stop()
                stop()
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

                  indexRegistries[indexRegistries.length - 1][fileNode.payload.name] = indexRegistries[indexRegistries.length - 1][fileNode.payload.name] + 1 || 0
                  // console.log('JSXElement indexRegistries', indexRegistries)

                  shouldPushIndex = false

                  traverseFileNode(
                    fileNode,
                    indexRegistries[indexRegistries.length - 1][fileNode.payload.name],
                    () => {
                      shouldContinue = false

                      x.stop()
                      stop()
                    }
                  )
                }
              }
            }
          }
        }

        if (!x.node.selfClosing && shouldPushIndex) {
          indexRegistries.push({})
        }

        // console.log('JSXElement post indexRegistries', indexRegistries)
      },
      JSXClosingElement() {
        // Prevent fragments from interering with indexing
        if (indexRegistries.length > 1) {
          indexRegistries.pop()
        }

        // console.log('JSXClosingElement indexRegistries', indexRegistries)
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

    // console.log('<----', fileNode.payload.name)
    // console.log('indexRegistries', indexRegistries)
    // console.log('hierarchy', hierarchy)
  }

  traverseFileNode(fileNode)

  return hierarchy
}

export default getComponentHierarchy
