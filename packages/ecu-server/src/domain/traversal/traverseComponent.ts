import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { FileNodeType, FunctionNodeType, HierarchyItemType, HierarchyTreeType, ImpactedType, ImportDeclarationsRegistry, IndexRegistryType } from '../../types'
import { ecuPropName } from '../../configuration'

import { getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'

import areArraysEqual from '../../utils/areArraysEqual'
import areArraysEqualAtStart from '../../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

import createHierarchyId from '../utils/createHierarchyId'
import extractIdAndIndex from '../utils/extractIdAndIndex'
import extractIdsAndIndexes from '../utils/extractIdsAndIndexes'

function formatHierarchyTrees(hierarchyTrees: any[]) {
  const retval: any[] = []

  if (!hierarchyTrees) return retval

  hierarchyTrees.forEach(hierarchyTree => {
    delete hierarchyTree.hierarchyId
    delete hierarchyTree.componentAddress
    delete hierarchyTree.onComponentAddress
    delete hierarchyTree.index

    const toPush = [hierarchyTree.label]
    const children = formatHierarchyTrees(hierarchyTree.children)

    if (children.length) toPush.push(children)

    retval.push(toPush)
  })

  return retval.flat()
}

type TraverseComponentEventsType = {
  onTraverseFile?: (fileNodes: FileNodeType[], indexRegistriesHash: string, componentRootIndexes: number[]) => () => void
  onBeforeHierarchyPush?: (paths: any[], fileNodes: FileNodeType[], indexRegistriesHash: string, componentRootIndexes: number[], componentIndex: number, hierarchyId: string) => void
  onHierarchyPush?: (paths: any[], fileNodes: FileNodeType[], indexRegistriesHash: string, componentRootIndexes: number[], componentIndex: number, hierarchyId: string) => void
  onSuccess?: (paths: any[], fileNodes: FileNodeType[], indexRegistriesHash: string, componentRootIndexes: number[], componentIndex: number) => void
}

function traverseComponent(componentAddress: string, hierarchyIds: string[], events: TraverseComponentEventsType = {}): ImpactedType[] {
  console.log('traverseComponent', componentAddress, hierarchyIds)

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`No file node found for component ${componentAddress}`)

    return []
  }

  const {
    onTraverseFile = () => () => {},
    onBeforeHierarchyPush = () => {},
    onHierarchyPush = () => {},
    onSuccess = () => {},
  } = events

  // const impacted: ImpactedType[] = [] // retval
  const hierarchyTrees: any[] = [{}] // retval
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const allFileNodes = getNodesByRole<FileNodeType>('File')
  const [, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: IndexRegistryType = {}
  const importDeclarationsRegistry: ImportDeclarationsRegistry = {}
  const hierarchyTreesIndexes: number[] = [0]
  // console.log('ids', ids)
  // console.log('indexes', indexes)

  function getCurrentHierarchyTree() {
    let currentHierarchyTree = hierarchyTrees[0]

    for (const hierarchyTreeIndex of hierarchyTreesIndexes.slice(1)) {
      currentHierarchyTree = currentHierarchyTree.children[hierarchyTreeIndex]
    }

    return currentHierarchyTree
  }

  function createNextHierarchyTree() {
    let currentHierarchyTree = hierarchyTrees[0]

    for (const hierarchyTreeIndex of hierarchyTreesIndexes.slice(1, -1)) {
      currentHierarchyTree = currentHierarchyTree.children[hierarchyTreeIndex]
    }

    currentHierarchyTree.children.push({})
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

  function traverseFileNode(fileNodes: FileNodeType[], previousPaths: any[] = [], indexRegistriesHash = '', componentRootIndexes: number[] = [0], stop = () => {}, increaseDepth = () => {}, decreaseDepth = () => {}) {

    const fileNode = fileNodes[fileNodes.length - 1]
    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    const previousFileNode = fileNodes[fileNodes.length - 2] || fileNode
    const previousComponentNode = getNodesByFirstNeighbourg<FunctionNodeType>(previousFileNode.address, 'DeclaresFunction')[0]

    const currentHierarchyTree = getCurrentHierarchyTree()

    // console.log('componentNode.payload.name', componentNode.payload.name)
    // console.log('hierarchyTreesIndexes', hierarchyTreesIndexes)
    // console.log('hierarchyTrees', JSON.stringify(formatHierarchyTrees(hierarchyTrees), null, 2))
    // console.log('currentHierarchyTree', currentHierarchyTree)

    currentHierarchyTree.componentAddress = componentNode.address
    currentHierarchyTree.onComponentAddress = previousComponentNode.address
    currentHierarchyTree.label = `${componentNode.payload.name}[${componentRootIndexes[componentRootIndexes.length - 1]}]`
    currentHierarchyTree.index = componentRootIndexes[componentRootIndexes.length - 1]
    currentHierarchyTree.children = []

    hierarchyTreesIndexes.push(0)

    // console.log('-> traverseFileNode', fileNode.payload.name, componentRootIndexes)

    // const onContinue = onTraverseFile(fileNodes, indexRegistriesHash, componentRootIndexes)

    const { ast } = fileNode.payload
    const indexRegistries: IndexRegistryType[] = [{}]
    let shouldContinue = true
    let shouldPushIndex = true
    let shouldPopIfSelfClosing = false

    // if (!impacted.some(x => x.fileNode.address === fileNode.address)) {
    //   impacted.push({ fileNode, ast, importDeclarationsRegistry })
    // }

    let depth = -1

    function createTraverser(currentFileNodes: FileNodeType[]) {
      const currentFileNode = currentFileNodes[currentFileNodes.length - 1]
      // const currentComponentNode = getNodesByFirstNeighbourg<FunctionNodeType>(currentFileNode.address, 'DeclaresFunction')[0]
      // const currentIndex = indexRegistries[indexRegistries.length - 1][currentFileNode.address] || 0
      const importDeclarations = importDeclarationsRegistry[currentFileNode.address] || []

      return {
        JSXElement(x: any) {

          if (!x.node.openingElement.selfClosing) {
            increaseDepth()
            depth++
          }

          shouldPopIfSelfClosing = false

          console.log('--> JSXElement', x.node.openingElement.name.name)

          const currentXs = [...previousPaths, x]
          const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

          // hierarchyId found means we're at an ecu-client Component
          if (idIndex !== -1) {
            const limitedHierarchyId = x.node.openingElement.attributes[idIndex].value.value

            if (limitedHierarchyId) {
              const [componentAddress] = extractIdAndIndex(limitedHierarchyId)
              const componentIndex = indexRegistries[indexRegistries.length - 1][componentAddress] = indexRegistries[indexRegistries.length - 1][componentAddress] + 1 || 0

              lastingIndexRegistry[limitedHierarchyId] = lastingIndexRegistry[limitedHierarchyId] + 1 || 0
              shouldPushIndex = true

              const hierarchyId = createHierarchyId(limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])

              createNextHierarchyTree()

              const currentHierarchyTree = getCurrentHierarchyTree()

              // console.log('JSX currentHierarchyTree', currentHierarchyTree)
              currentHierarchyTree.hierarchyId = hierarchyId
              currentHierarchyTree.onComponentAddress = componentNode.address
              currentHierarchyTree.label = `${x.node.openingElement.name.name}[${componentIndex}]`
              currentHierarchyTree.index = componentIndex
              currentHierarchyTree.children = []

              // console.log('--->', x.node.openingElement.name.name, limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])

              // onBeforeHierarchyPush(currentXs, currentFileNodes, indexRegistriesHash, componentRootIndexes, componentIndex, hierarchyId)

              if (isSuccessiveNodeFound(hierarchyId)) {
                lastingHierarchyIds.push(hierarchyId)

                console.log('PUSHED')

                // onHierarchyPush(currentXs, currentFileNodes, indexRegistriesHash, componentRootIndexes, componentIndex, hierarchyId)

                if (isFinalNodeFound()) {
                  console.log('SUCCESS')

                  shouldContinue = false

                  // onSuccess(currentXs, currentFileNodes, indexRegistriesHash, componentRootIndexes, componentIndex)
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
              const absolutePath = possiblyAddExtension(path.join(path.dirname(currentFileNode.payload.path), relativeImportDeclaration.value))
              const nextComponentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (nextComponentNode) {
                const nextFileNode = allFileNodes.find(n => n.payload.path === nextComponentNode.payload.path)

                if (nextFileNode) {
                  // console.log('--->', nextFileNode.payload.name)

                  // const parentChildren = x.parentPath.node.children.filter((x: any) => x.type === 'JSXElement' || x.type === 'JSXFragment')

                  shouldPushIndex = false
                  shouldPopIfSelfClosing = true

                  const nextComponentRootIndex = indexRegistries[indexRegistries.length - 1][nextFileNode.address] = indexRegistries[indexRegistries.length - 1][nextFileNode.address] + 1 || 0
                  // const currentHierarchyTrees = getCurrentHierarchyTrees()

                  // hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++

                  createNextHierarchyTree()

                  traverseFileNode(
                    [...currentFileNodes, nextFileNode],
                    currentXs,
                    JSON.stringify(indexRegistries),
                    [...componentRootIndexes, nextComponentRootIndex],
                    () => {
                      shouldContinue = false

                      x.stop()
                      stop()
                    },
                    () => {
                      increaseDepth()
                      depth++
                    },
                    () => {
                      decreaseDepth()
                      depth--
                    }
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
            console.log('depth', depth, x.node.openingElement.name.name)

            if (x.node.openingElement.selfClosing && shouldPopIfSelfClosing) {
              console.log('1 hierarchyTreesIndexes', hierarchyTreesIndexes)

              // console.log('depth, hierarchyTreesIndexes', depth, hierarchyTreesIndexes.length)
              for (let i = 0; i < depth; i++) {
                hierarchyTreesIndexes.pop()
              }

              console.log('2 hierarchyTreesIndexes', hierarchyTreesIndexes)
            }

            // else {
            //   depth++

            // }

            // console.log('!', shouldPushIndex, !x.node.openingElement.selfClosing)
            if (shouldPushIndex && !x.node.openingElement.selfClosing) {
              indexRegistries.push({})
              hierarchyTreesIndexes.push(0)
            }
            else if (hierarchyTreesIndexes.length > 0) {
              hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++

            }

            // else {

            //   // if (shouldPopIfSelfClosing && x.node.openingElement.selfClosing) {
            //   //   console.log('POP POP POP', depth)

            //     // hierarchyTreesIndexes.pop()
            //     // console.log('INDEXING', x.node.openingElement.selfClosing, hierarchyTreesIndexes)
            //   // }
            //   // if (x.node.openingElement.name.name === 'DualCoolDiv' || x.node.openingElement.name.name === 'CoolDaddy') {
            //   //   console.log('x.node.openingElement.selfClosing', x.node.openingElement.selfClosing)
            //   // }
            //   // createNextHierarchyTree()
              // TODO shouldPop = x.node.openingElement.selfClosing

            //   hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++
            // }
          }
          // if (!(x.shouldStop || x.removed) && x.node.selfClosing && shouldPushIndex) {
          //   hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++
          // }
          // console.log('<-- JSXELEMENT')
          // console.log('componentNode.payload.name', componentNode.payload.name)
          // console.log('hierarchyTreesIndexes', hierarchyTreesIndexes)
          // console.log('hierarchyTrees', JSON.stringify(formatHierarchyTrees(hierarchyTrees), null, 2))
          // console.log('<-- JSXELEMENT -->')

        },
        JSXClosingElement(x: any) {
          // Prevent fragments from interering with indexing
          if (indexRegistries.length > 1) {
            indexRegistries.pop()
          }
          if (hierarchyTreesIndexes.length > 0) {
            // console.log('POPPING')
            hierarchyTreesIndexes.pop()
            // createNextHierarchyTree()
            if (hierarchyTreesIndexes.length > 0) {
              hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++
            }
          }

          console.log('x.node', x.node)

          console.log('DECREASING')
          // decreaseDepth()
          // depth--
        },
        JSXExpressionContainer(x: any) {
          if (!(x.node.expression.type === 'Identifier' && x.node.expression.name === 'children')) return

          const previousX = previousPaths[previousPaths.length - 1]
          const previousFileNodes = currentFileNodes.slice()

          previousFileNodes.pop()

          if (!(previousX && previousFileNodes.length)) return

          console.log('CHILDREN')

          // increaseDepth()
          // depth++
          // If children is found, traverse children with new traverser
          // createNextHierarchyTree()
          // hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]--
          previousX.traverse(createTraverser(previousFileNodes))
          hierarchyTreesIndexes.pop()
          // depth--
          // decreaseDepth()
          // hierarchyTreesIndexes[hierarchyTreesIndexes.length - 1]++

        },
      }
    }

    traverse(ast, createTraverser(fileNodes))

    if (shouldContinue) {
      // onContinue()
    }
  }

  traverseFileNodesToFindImportDeclarations(fileNode)
  traverseFileNode([fileNode])

  // console.log('--> hierarchyTrees', JSON.stringify(hierarchyTrees, null, 2))

  return hierarchyTrees
}

export default traverseComponent
