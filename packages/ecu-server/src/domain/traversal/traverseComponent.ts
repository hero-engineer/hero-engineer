import path from 'node:path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { FileNodeType, FunctionNodeType, HierarchyTreeType, ImpactedType, ImportDeclarationsRegistry, IndexRegistryType } from '../../types'
import { ecuPropName } from '../../configuration'

import { getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'

import areArraysEqual from '../../utils/areArraysEqual'
import areArraysEqualAtStart from '../../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

import createHierarchyId from '../utils/createHierarchyId'
import extractIdAndIndex from '../utils/extractIdAndIndex'
import extractIdsAndIndexes from '../utils/extractIdsAndIndexes'
// import formatHierarchyTrees from '../utils/formatHierarchyTrees'

type TraverseComponentEventsType = {
  onTraverseFile?: (fileNodes: FileNodeType[]) => void
  onHierarchyPush?: (paths: any[], fileNodes: FileNodeType[], hierarchyTree: HierarchyTreeType) => void
  onSuccess?: (paths: any[], fileNodes: FileNodeType[], hierarchyTree: HierarchyTreeType) => void
}

type TraverseComponentReturnType = {
  impacted: ImpactedType[],
  hierarchy: HierarchyTreeType[],
}

function traverseComponent(componentAddress: string, hierarchyIds: string[], events: TraverseComponentEventsType = {}): TraverseComponentReturnType {
  // console.log('traverseComponent', componentAddress, hierarchyIds)

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`No file node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: [],
    }
  }

  const {
    onTraverseFile = () => {},
    onHierarchyPush = () => {},
    onSuccess = () => {},
  } = events

  const impacted: ImpactedType[] = [] // retval
  const hierarchyTrees: HierarchyTreeType[] = [] // retval
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const allFileNodes = getNodesByRole<FileNodeType>('File')
  const [, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: IndexRegistryType = {}
  const importDeclarationsRegistry: ImportDeclarationsRegistry = {}
  const hierarchyTreesIndexes: number[] = []

  function getCurrentHierarchyTrees() {
    let currentHierarchyTrees = hierarchyTrees

    for (const hierarchyTreeIndex of hierarchyTreesIndexes) {
      currentHierarchyTrees = currentHierarchyTrees[hierarchyTreeIndex].children
    }

    return currentHierarchyTrees
  }

  function appendToHierarchy(partialHierarchyTree: Omit<HierarchyTreeType, 'children'>) {
    const nextHierarchyTree = {
      ...partialHierarchyTree,
      children: [],
    }

    hierarchyTreesIndexes.push(-1 + getCurrentHierarchyTrees().push(nextHierarchyTree))

    return nextHierarchyTree
  }

  function isSuccessiveNodeFound(nextHierarchyId: string) {
    const nextHierarchyIds = [...lastingHierarchyIds, nextHierarchyId]
    const [nextLimitedHierarchyId] = extractIdAndIndex(nextHierarchyId)

    return areArraysEqualAtStart(nextHierarchyIds, hierarchyIds) && lastingIndexRegistry[nextLimitedHierarchyId] === indexes[nextHierarchyIds.length - 1]
  }

  function isFinalNodeFound() {
    const lastingHierarchyIdsIndexes = lastingHierarchyIds.map(hierarchyId => extractIdAndIndex(hierarchyId)[1])

    return areArraysEqual(lastingHierarchyIds, hierarchyIds) && areArraysEqual(lastingHierarchyIdsIndexes, indexes)
  }

  function traverseFileNodesToFindImportDeclarations(fileNode: FileNodeType) {
    traverse(fileNode.payload.ast, {
      // Build the importDeclarationsRegistry for the file
      ImportDeclaration(x: any) {
        if (!importDeclarationsRegistry[fileNode.address]) {
          importDeclarationsRegistry[fileNode.address] = []
        }

        importDeclarationsRegistry[fileNode.address].push({
          value: x.node.source.value,
          specifiers: x.node.specifiers.map((x: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => x.local.name),
        })
      },
    })

    const importedFileNodes = getNodesByFirstNeighbourg<FileNodeType>(fileNode.address, 'ImportsFile')

    importedFileNodes.forEach(fileNode => {
      if (importDeclarationsRegistry[fileNode.address]) return

      traverseFileNodesToFindImportDeclarations(fileNode)
    })
  }

  function traverseFileNode(fileNodes: FileNodeType[], previousPaths: any[] = [], componentRootIndexes: number[] = [0], stop = () => {}) {

    const fileNode = fileNodes[fileNodes.length - 1]
    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    const previousFileNode = fileNodes[fileNodes.length - 2] || fileNode
    const previousComponentNode = getNodesByFirstNeighbourg<FunctionNodeType>(previousFileNode.address, 'DeclaresFunction')[0]

    appendToHierarchy({
      fileAddress: fileNode.address,
      componentName: componentNode.payload.name,
      componentAddress: componentNode.address,
      onComponentAddress: previousComponentNode.address,
      label: `${componentNode.payload.name}[${componentRootIndexes[componentRootIndexes.length - 1]}]`,
      index: componentRootIndexes[componentRootIndexes.length - 1],
    })

    // console.log('--> TRAVERSE', componentNode.payload.name)
    // console.log('tree:', JSON.stringify(formatHierarchyTrees(hierarchyTrees), null, 2))
    // console.log('indexes', hierarchyTreesIndexes)

    const { ast } = fileNode.payload
    const indexRegistries: IndexRegistryType[] = [{}]
    let shouldPushIndex = true // TODO one of these should be removed
    let shouldIncrement = true
    let shouldPop = true

    if (!impacted.some(x => x.fileNode.address === fileNode.address)) {
      impacted.push({ fileNode, ast, importDeclarationsRegistry })
    }

    onTraverseFile(fileNodes)

    // Create a traerser object for given files
    function createTraverser(currentFileNodes: FileNodeType[]) {
      const currentFileNode = currentFileNodes[currentFileNodes.length - 1]
      const importDeclarations = importDeclarationsRegistry[currentFileNode.address] || []

      return {
        JSXElement(x: any) {
          // console.log('--> JSXElement', x.node.openingElement.name.name)
          // console.log('tree:', JSON.stringify(formatHierarchyTrees(hierarchyTrees), null, 2))
          // console.log('indexes', hierarchyTreesIndexes)

          shouldPop = true

          const currentXs = [...previousPaths, x]
          const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

          // hierarchyId found means we're at an ecu-client Component
          if (idIndex !== -1) {
            const limitedHierarchyId = x.node.openingElement.attributes[idIndex].value.value

            if (limitedHierarchyId) {
              shouldPushIndex = true
              shouldIncrement = false
              lastingIndexRegistry[limitedHierarchyId] = lastingIndexRegistry[limitedHierarchyId] + 1 || 0

              const [componentAddress] = extractIdAndIndex(limitedHierarchyId)
              const componentIndex = indexRegistries[indexRegistries.length - 1][componentAddress] = indexRegistries[indexRegistries.length - 1][componentAddress] + 1 || 0

              const hierarchyId = createHierarchyId(limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])
              const hierarchyTree = appendToHierarchy({
                hierarchyId,
                fileAddress: currentFileNode.address,
                componentName: x.node.openingElement.name.name,
                onComponentAddress: componentNode.address,
                label: `${x.node.openingElement.name.name}[${componentIndex}]`,
                index: componentIndex,
              })

              if (isSuccessiveNodeFound(hierarchyId)) {
                lastingHierarchyIds.push(hierarchyId)

                console.log('PUSHED')

                onHierarchyPush(currentXs, currentFileNodes, hierarchyTree)

                if (isFinalNodeFound()) {
                  console.log('SUCCESS')

                  onSuccess(currentXs, currentFileNodes, hierarchyTree)

                  x.stop()
                  stop()
                }
              }
            }
          }
          // No hierarchyId found means we're at an imported Component node
          else if (importDeclarations.length) {
            const componentName = x.node.openingElement.name.name
            const relativeImportDeclaration = importDeclarations.find(x => x.value.startsWith('.') && x.specifiers.includes(componentName))

            if (relativeImportDeclaration) {
              const absolutePath = possiblyAddExtension(path.join(path.dirname(currentFileNode.payload.path), relativeImportDeclaration.value), currentFileNode.payload.extension)
              const nextComponentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (nextComponentNode) {
                const nextFileNode = allFileNodes.find(n => n.payload.path === nextComponentNode.payload.path)

                if (nextFileNode) {
                  // console.log('--->', nextFileNode.payload.name)

                  shouldIncrement = true
                  shouldPushIndex = false

                  const nextComponentRootIndex = indexRegistries[indexRegistries.length - 1][nextFileNode.address] = indexRegistries[indexRegistries.length - 1][nextFileNode.address] + 1 || 0

                  traverseFileNode(
                    [...currentFileNodes, nextFileNode],
                    currentXs,
                    [...componentRootIndexes, nextComponentRootIndex],
                    () => {
                      x.stop()
                      stop()
                    },
                  )

                  if (!(x.shouldStop || x.removed)) {
                    // console.log('SKIPPING')

                    x.skip()
                  }
                }
              }
            }
          }

          if (!(x.shouldStop || x.removed)) {
            if (shouldPushIndex && !x.node.openingElement.selfClosing) {
              indexRegistries.push({})
            }
            if (x.node.openingElement.selfClosing) {
              hierarchyTreesIndexes.pop()
            }
            else if (shouldIncrement && hierarchyTreesIndexes.length > 0) {
              hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++
            }
          }

          // console.log('<-- JSXElement', x.node.openingElement.name.name)
          // console.log('tree:', JSON.stringify(formatHierarchyTrees(hierarchyTrees), null, 2))
          // console.log('indexes', hierarchyTreesIndexes)
          // console.log('<--')
        },
        JSXClosingElement() {
          // Prevent fragments from interering with indexing
          if (indexRegistries.length > 1) {
            indexRegistries.pop()
          }
          if (hierarchyTreesIndexes.length > 0) {
            if (shouldPop) {
              // console.log('POPPING')
              hierarchyTreesIndexes.pop()
            }
            else {
              // console.log('DECREASING')
              hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]--
            }
          }
        },
        JSXExpressionContainer(x: any) {
          if (!(x.node.expression.type === 'Identifier' && x.node.expression.name === 'children')) return

          const previousX = previousPaths[previousPaths.length - 1]
          const previousFileNodes = [...currentFileNodes]

          previousFileNodes.pop()

          if (!(previousX && previousFileNodes.length)) return

          // console.log('CHILDREN')

          // If children is found, traverse children with new traverser
          previousX.traverse(createTraverser(previousFileNodes))
          hierarchyTreesIndexes.pop()

          shouldPop = false

          // console.log('tree:', JSON.stringify(formatHierarchyTrees(hierarchyTrees), null, 2))
          // console.log('indexes', hierarchyTreesIndexes)
          // console.log('---')
        },
      }
    }

    traverse(ast, createTraverser(fileNodes))
  }

  traverseFileNodesToFindImportDeclarations(fileNode)
  traverseFileNode([fileNode])

  return {
    impacted,
    hierarchy: hierarchyTrees,
  }
}

export default traverseComponent
